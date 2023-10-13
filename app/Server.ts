import { config } from "./config";
import { MongoDB } from "./data/repository/database.connect";
import { WhatsappRepository } from "./data/repository/repository-impl/whatsapp-repository";
import { Logger } from "./utils/Logger";
import qrcode from "qrcode-terminal";
import { Client, LocalAuth } from "whatsapp-web.js";

export class Server {
  static {
    process.on("warning", (error) => {
      Logger.processError("MINT [Warning]", error); //process.send({ event: "error", detail: `${error}`, type: "error" });
    });
    process.on("uncaughtException", (error) => {
      Logger.processError("MINT [UE]", error); //process.send({ event: "error", detail: `${error}`, type: "error" });
    });
    process.on("unhandledRejection", (error) => {
      Logger.processError("MINT [UR]", <any>error); //process.send({ event: "error", detail: `${error}`, type: "error" });
    });
    process.on("close", (code, signal) => {
      Logger.processWarn(
        `[MINT] Worker closed with code ${code} and signal ${signal}`
      );
    });
    process.on("exit", (code: any, signal: any) => {
      Logger.processWarn(
        `[MINT] Worker exitted with code ${code} and signal ${signal}`
      );
    });
    process.on("disconnect", () => {
      Logger.processWarn(`[MINT] Main processes exited. Killing process.`);
      process.exit(0);
    });
  }

  static async startServer() {
    await Server.startDatabase();
    await Server.connectToWhatsapp();
    Logger.success("Server is up and running 🚀");
  }

  static async connectToWhatsapp() {
    const client = new Client({ authStrategy: new LocalAuth() });

    client.on("qr", (qr: any) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("Client is ready!");
    });

    // client.on('message_create', async (message) => {
    //     if (message.author !== undefined){
    //         console.log(message)
    //     console.log(Object.values(message)[0].body);
    //     const name = Object.values(message)[0]?.notifyName;
    //     // client.getChats().then((chats) => {
    //     // 	const myGroup = chats.find((chat) => chat.name === 'Automatation Whatsapp');
    //     // });

    //     if (
    //         message.body.toLocaleLowerCase().includes('hi') ||
    //         message.body.toLocaleLowerCase().includes('hello')
    //     ) {
    //         message.reply(`Hi ${name ?? "I don't yet know your name!"}` + ' How are you?');
    //     } else {
    //         message.reply(`Hi ${name}, to interact with me, say Hi or Hello! 👋`);
    //     }

    // }

    // });

    client.on("message_create", async (message) => {
        if (message.author !== undefined){
            const user = await WhatsappRepository.findUserByName(message.author);
            console.log(user) 
            if (user.length > 0){
                await message.reply('what is your email?');
            } else {
                await message.reply('what is your name?');
            }

    //     const name = message.author;
    //     await Server.storeUserInfo(name);


      }
    });

    //prompt that asks for users email adress

    // client.on("message_create", async (message) => {
    //   if (
    //     message.body.toLocaleLowerCase().includes("hi") ||
    //     message.body.toLocaleLowerCase().includes("hello")
    //   ) {
    //     message.reply(
    //       `Hi ${name ?? "I don't yet know your name!"}` + " How are you?"
    //     );
    //   } else {
    //     message.reply(`Hi ${name}, to interact with me, say Hi or Hello! 👋`);
    //   }
    // });

    client.initialize();
  }

  static async storeUserInfo(username: string) {
    try {
      const user = await WhatsappRepository.create(username);
    //   console.log(user);

    //   const email = await WhatsappRepository.createEmail(email);
    //   console.log(email);
    } catch (error) {
      Logger.warn("Error storing user information: " + error.message);
    }
  }

  private static async startDatabase() {
    if (process.env.NODE_ENV == "development") {
      Logger.info("Running application in Development mode.");
      config.mongoDB.url = config.mongoDB.dbLocalURL;
    } else if (process.env.NODE_ENV == "production") {
      Logger.info("Running application in Production mode.");
      config.mongoDB.url = config.mongoDB.atlasURL;
    }

    await MongoDB.connectToDatabase(config.mongoDB.url);
  }
}

package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"
	diako "github.com/cuppyzh/Go-Diako"
	"github.com/gin-gonic/gin"
	"github.com/gookit/event"
	"github.com/joho/godotenv"
)

var Discord *discordgo.Session

func main() {
	godotenv.Load()
	setupEventListener()
	setupWebApi()
	setupBaseDiscordBot()

}

func setupWebApi() {
	router := gin.Default()
	diako.SetupRouter(router)

	go router.Run(":9008")
}

func setupBaseDiscordBot() {
	log.Println("Setting up Discord bot")

	token := os.Getenv("BOT_TOKEN")

	discord, err := discordgo.New("Bot " + token)

	if err != nil {
		panic(err)
	}

	// In this example, we only care about receiving message events.
	discord.Identify.Intents = discordgo.IntentsGuildMessages

	err = discord.Open()
	if err != nil {
		panic(err)
	}

	Discord = discord

	// Wait here until CTRL-C or other term signal is received.
	fmt.Println("Bot is now running.  Press CTRL-C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)
	<-sc
}

func sendMessageToFcChannel(sender string, message string) {

	discordMessage := "***" + sender + "***: " + message
	_, err := Discord.ChannelMessageSend(os.Getenv("DISCORD_CHANNEL_ID"), discordMessage)
	if err != nil {
		fmt.Println(err)
	}
}

var eventHandler = func(e event.Event) error {
	sendMessageToFcChannel(fmt.Sprintf("%v", e.Data()["Sender"]), fmt.Sprintf("%v", e.Data()["Message"]))
	return nil
}

func setupEventListener() {
	event.On("diako.message.recieved", event.ListenerFunc(eventHandler), event.High)
}

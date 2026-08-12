# Duck Hunt for webOS 🎯🦆

A **webOS port of Duck Hunt**, based on the original HTML5 Canvas game created by **Adi52**.

This version has been adapted to run as a webOS application and is designed to be played on an LG TV using the **LG Magic Remote** as the pointing and shooting device.

The original project can be found here:

[Adi52/duck-hunt on GitHub](https://github.com/Adi52/duck-hunt)

---

## 🎮 About

This project brings the classic Duck Hunt experience to **LG webOS TVs**.

The original game was created by **Adi52** as a retro Duck Hunt implementation using HTML5 Canvas and JavaScript. This project uses that work as its starting point and adapts it for the webOS environment, with particular attention to TV controls and the Magic Remote.

### Main changes

* 📺 Adapted for **LG webOS**
* 🎮 **LG Magic Remote** support
* 🖱️ Uses the Magic Remote pointer to aim
* 🔫 Remote click/selection is used to shoot
* 🖥️ Optimized for TV screen usage
* 🎨 Adapted menus and UI for the TV environment
* 🏆 High-score support
* ⏸️ Option to pause the game

---

## 🕹️ How to play

Point the **LG Magic Remote** at the screen to control the aiming cursor.

| Action | Magic Remote                                 |
| ------ | -------------------------------------------- |
| Aim    | Move the pointer                             |
| Shoot  | Click / press the OK remote button           |
| Start  | Select `START GAME`                          |
| Pause  | Press Back button to open pause menu         |

The objective is simple: **shoot the ducks before they escape!**

Each round consists of multiple sub-rounds. You have a limited number of shots for each duck, and the difficulty increases as you progress.

---

## 📺 Requirements

* LG Smart TV running **LG webOS**
* LG **Magic Remote**
* webOS application development environment
* [webOS CLI](https://webostv.developer.lge.com/develop/tools/cli-dev-guide)

The application is intended primarily for **LG webOS TVs** and is not designed as a general-purpose mobile application.

---

## 🛠️ Development

### Clone the repository

```bash
git clone https://github.com/manthock/duck-hunt-webos
cd duck-hunt-webos
```
---

## 📦 Building for webOS

After making changes to the source code, package the application using the webOS CLI:

```bash
ares-package .
```

This generates an `.ipk` package that can be installed on a compatible webOS TV or emulator.

For example:

```bash
ares-install <generated-package>.ipk
```

You can then launch the application using:

```bash
ares-launch <application-id>
```

Make sure that the webOS CLI is correctly configured and that your TV/development device has been registered before attempting to install the application.

---

## ⚠️ Disclaimer

Duck Hunt is a property of **Nintendo**. This project is a fan-made, non-commercial port/adaptation created for educational and preservation purposes.

This repository is not affiliated with, endorsed by, or sponsored by Nintendo or LG.

Please verify the licensing terms of the original project and of any assets included in your distribution before publishing or redistributing the application.

---

## ⭐ Credits

### Original Duck Hunt implementation

**Adi52**

Original HTML5 Canvas / JavaScript implementation:

[https://github.com/Adi52/duck-hunt](https://github.com/Adi52/duck-hunt)

### webOS Port

**manthock**

Adaptation for LG webOS and Magic Remote support.

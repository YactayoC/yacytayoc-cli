#!/usr/bin/env node
import { execSync } from "child_process";
import figlet from "figlet";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import chalk from "chalk";

// Esto sirve para crear un spinner
const spinner = createSpinner("Creando proyecto...");

// Esto sirve para ejecutar comandos en la terminal
const runCommand = (command) => {
  execSync(command, { stdio: "inherit" });
};

// Esto sirve para crear un nuevo proyecto
const gitCommand = (repo, repoName) =>
  `git clone --depth 1 ${repo} ${repoName}`;

// Esto sirve para instalar las dependencias
const deepInstall = (repoName) => `cd ${repoName} && yarn`;

// Esto sirve para eliminar el repositorio por si algo sale mal
const rollBack = (repoName) => `rm -rf ${repoName}`;

const boiler_plates = [
  {
    name: "ReactTS",
    value: "https://github.com/YactayoC/boilerplate_react-ts.git",
  },
  {
    name: "VueTS",
    value: ".git",
  },
  {
    name: "NextJS",
    value: ".git",
  },
];

inquirer
  .prompt([
    {
      type: "input",
      message: "Name project:",
      name: "repoName",
      default: "my-project",
    },
    {
      type: "list",
      message: "Select boilerplate:",
      name: "repo",
      choices: boiler_plates,
    },
  ])
  .then(({ repo, repoName }) => {
    spinner.start();
    try {
      runCommand(gitCommand(repo, repoName));
      //   runCommand(deepInstall(repoName));
      figlet(`${repoName} is created`, function (err, data) {
        if (err) {
          console.log("Something went wrong..");
          console.dir(err);
          return;
        }

        spinner.success("DONE");
        console.log(data);
        console.log(chalk.green("Get started"));
        console.log(
          chalk.blue("Run ") + chalk.green(`cd ${repoName} && yarn start`)
        );
      });
    } catch (error) {
      if (error.message.includes("cd")) {
        runCommand(rollBack(repoName));
      }
      spinner.error({
        text: chalk.bgRed("Erro: ") + " " + error.message,
      });
    }
  });

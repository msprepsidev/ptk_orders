// list to add ESM to ignore
const esModules = ['uuid'].join('|');


module.exports = {
  testEnvironment: "node",
  reporters: [
    "default", // Utilise le reporter standard
    ["jest-junit", {
      outputDirectory: "test_results", // Dossier où les résultats seront enregistrés
      outputName: "junit.xml" // Nom du fichier de sortie
    }]
  ]
};


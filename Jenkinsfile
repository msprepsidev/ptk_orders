pipeline {
    agent any
    
    environment {
        // Définir les variables d'environnement si nécessaire
        GIT_URL = 'https://github.com/msprepsidev/ptk_orders'
        PROJECT_DIR = 'ptk_orders'
    }

    stages {
        stage('Prepare Classses') {
            steps {
                script {
                    // Vérifier si le dossier existe et le nettoyer
                    if (isUnix()) {
                        sh """
                        if [ -d "${PROJECT_DIR}" ]; then
                            echo "Cleaning existing directory"
                            rm -rf ${PROJECT_DIR}
                        fi
                        """
                    } else {
                        powershell """
                        if (Test-Path -Path "${PROJECT_DIR}") {
                            Write-Host "Cleaning existing directory"
                            Remove-Item "${PROJECT_DIR}" -Force -Recurse
                        }
                        """
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                script {
                    // Cloner le dépôt Git
                    if (isUnix()) {
                        sh "git clone ${GIT_URL}"
                    } else {
                        powershell "git clone ${GIT_URL}"
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    dir("${PROJECT_DIR}") {
                        // Exécuter npm install dans le répertoire du projet cloné
                        powershell 'npm install'
                    }
                }
            }
        }

        stage('Tests') {
            steps {
                script {
                    dir("${PROJECT_DIR}") {
                        
                        powershell 'npm test'
                    }
                }
            }
        }
    
    }
    // autres configurations
    
    post {
        always {
            script {
                dir("${PROJECT_DIR}/test_results") {
                    junit 'junit.xml'
                }
            }
            echo 'Sending email notification...'
            // Configurer pour envoyer des emails ici
        }
    }
}

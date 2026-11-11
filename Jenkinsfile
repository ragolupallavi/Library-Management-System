pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out Library Management System project'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Installing project dependencies'
                bat 'npm ci'
            }
        }

        stage('Test') {
            steps {
                echo 'Checking JavaScript files'

                bat 'node --check server.js'
                bat 'node --check routes/bookRoutes.js'
                bat 'node --check config/db.js'
                bat 'node --check public/script.js'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Library Management System Docker image'

                bat '"C:\\Users\\Pallavi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t library-management-system .'
            }
        }

        stage('Docker Compose Deploy') {
            steps {
                echo 'Deploying using Docker Compose'

                withCredentials([string(credentialsId: 'db-password', variable: 'DB_PASSWORD')]) {

                    bat '''
                        "C:\\Users\\Pallavi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker-compose.exe" -p library-management-system up -d --build
                    '''
                }
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Building Kubernetes application image'

                bat '''
                    set "KUBECONFIG=C:\\Windows\\System32\\config\\systemprofile\\.kube\\config"

                    "C:\\Users\\Pallavi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t library-management-k8s:%BUILD_NUMBER% .

                    "C:\\Users\\Pallavi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" set image deployment/library-deployment library-container=library-management-k8s:%BUILD_NUMBER%

                    "C:\\Users\\Pallavi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" rollout status deployment/library-deployment --timeout=180s

                    "C:\\Users\\Pallavi\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\kubectl.exe" get pods
                '''
            }
        }

    }
}
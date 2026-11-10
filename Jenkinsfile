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
                bat 'docker build -t library-management-system .'
            }
        }
    }
}
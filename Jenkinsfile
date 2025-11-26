pipeline {
    agent any

    triggers {
        // check GitHub every 2 minutes
        pollSCM('H/2 * * * *')
    }

    stages {

        stage('Install dependencies') {
            steps {
                sh '''
                export PATH=/opt/homebrew/bin:$PATH

                cd frontend
                npm install
                '''
            }
        }

        stage('Run Vite dev server') {
            steps {
                sh '''
                export PATH=/opt/homebrew/bin:$PATH

                pm2 delete careercoach || true

                cd frontend

                pm2 start npm --name careercoach -- run dev

                pm2 save
                '''
            }
        }
    }
}

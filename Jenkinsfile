pipeline {
    agent any

    tools {
        nodejs 'node18'   // Make sure you added this in Global Tool Configuration
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Install dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Vite dev server') {
            steps {
                sh '''
                # stop previous instance if exists
                pm2 delete careercoach || true

                cd frontend

                # start Vite dev server exactly like npm run dev
                pm2 start npm --name careercoach -- run dev

                # save PM2 process list
                pm2 save
                '''
            }
        }
    }
}

pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Install dependencies') {
            steps {
                // add Node path so Jenkins can see npm
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

                # stop previous instance if exists
                pm2 delete careercoach || true

                cd frontend

                # start Vite dev server
                pm2 start npm --name careercoach -- run dev

                pm2 save
                '''
            }
        }
    }
}

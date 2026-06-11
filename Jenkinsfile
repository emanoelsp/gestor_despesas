pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    timestamps()
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
      }
    }

    stage('Install') {
    steps {
        bat 'npm install'
    }
}

    stage("Unit Tests") {
      steps {
        sh "npm run test -- --runInBand"
      }
    }

    stage("Build") {
      steps {
        sh "npm run build"
      }
    }

    stage("E2E Tests (Cypress + Cucumber)") {
      steps {
        sh "npm run test:e2e:ci"
      }
      post {
        always {
          archiveArtifacts artifacts: "cypress/screenshots/**/*.png,cypress/videos/**/*.mp4",
                           allowEmptyArchive: true
        }
      }
    }

    stage("Deploy Vercel") {
      when {
        branch "main"
      }
      steps {
        // Pré-requisito: cadastre as três credenciais abaixo em
        // Jenkins → Manage Jenkins → Credentials → (global) → Add Credentials
        //   Tipo: Secret text
        //   IDs: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
        // Os valores vêm do painel da Vercel (Settings → Tokens / General).
        withCredentials([
          string(credentialsId: "VERCEL_TOKEN",      variable: "VERCEL_TOKEN"),
          string(credentialsId: "VERCEL_ORG_ID",     variable: "VERCEL_ORG_ID"),
          string(credentialsId: "VERCEL_PROJECT_ID", variable: "VERCEL_PROJECT_ID"),
        ]) {
          sh "npm install --global vercel@latest"
          sh "vercel pull --yes --environment=production --token=$VERCEL_TOKEN"
          sh "vercel build --prod --token=$VERCEL_TOKEN"
          sh "vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN"
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline concluída. Deploy publicado na Vercel."
    }
    failure {
      echo "Pipeline falhou. Deploy bloqueado. Colete os logs para o relatório."
    }
  }
}

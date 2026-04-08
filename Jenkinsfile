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

    stage("Install") {
      steps {
        sh "npm ci"
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

    stage("Deploy Vercel") {
      when {
        branch "main"
      }
      steps {
        echo "# TODO implement: cadastrar VERCEL_TOKEN, VERCEL_ORG_ID e VERCEL_PROJECT_ID em Jenkins Credentials."
        echo "# TODO implement: encapsular o deploy com withCredentials e definir a estrategia final da Vercel CLI."
        echo "# TODO implement: garantir que o deploy so ocorra quando a pipeline inteira estiver verde."
      }
    }
  }

  post {
    success {
      echo "# TODO implement: registrar a URL gerada pela Vercel e o commit publicado no relatorio tecnico."
    }
    failure {
      echo "# TODO implement: coletar a evidencia da falha para a analise de causa raiz."
    }
  }
}

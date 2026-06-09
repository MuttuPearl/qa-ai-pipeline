pipeline {
  agent any

  tools {
    nodejs 'NodeJS-24'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Install Browsers') {
      steps {
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npx playwright test'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**',
                       allowEmptyArchive: true
    }
    success {
      echo 'All tests PASSED! '
    }
    failure {
      echo 'Tests FAILED! '
    }
  }
}
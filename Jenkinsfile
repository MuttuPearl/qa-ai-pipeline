pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.40.0-jammy'
      args '--ipc=host'
    }
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
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
      echo 'All tests PASSED! ✅'
    }
    failure {
      echo 'Tests FAILED! ❌'
    }
  }
}
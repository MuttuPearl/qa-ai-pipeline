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
        sh 'npx playwright install chromium'
        sh 'npx playwright install-deps chromium'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npx playwright test --project=chromium'
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
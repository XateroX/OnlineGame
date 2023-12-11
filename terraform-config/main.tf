
provider "google" {
  project = "dp-rct-dev"
  region  = "europe-west2"
}

locals {
  branches = ["dev", "test", "prod"]

  client_urls = {
    dev  = data.google_secret_manager_secret_version.client_url_dev.secret_data
    test = data.google_secret_manager_secret_version.client_url_test.secret_data
    prod = data.google_secret_manager_secret_version.client_url_prod.secret_data
  }

  server_urls = {
    dev  = data.google_secret_manager_secret_version.server_url_dev.secret_data
    test = data.google_secret_manager_secret_version.server_url_test.secret_data
    prod = data.google_secret_manager_secret_version.server_url_prod.secret_data
  }
}

data "google_secret_manager_secret_version" "client_url_dev" {
  secret = "client_url_dev"
}

data "google_secret_manager_secret_version" "server_url_dev" {
  secret = "server_url_dev"
}

data "google_secret_manager_secret_version" "client_url_test" {
  secret = "client_url_test"
}

data "google_secret_manager_secret_version" "server_url_test" {
  secret = "server_url_test"
}

data "google_secret_manager_secret_version" "client_url_prod" {
  secret = "client_url_prod"
}

data "google_secret_manager_secret_version" "server_url_prod" {
  secret = "server_url_prod"
}


resource "google_cloudbuild_trigger" "server_default" {
  count = length(local.branches)
  name = "trigger-${local.branches[count.index]}"
  github {
    owner = "XateroX"
    name  = "OnlineGame"
    push {
      branch = "^${local.branches[count.index]}$"
    }
  }
  filename = "online-game-server/cloudbuild.yaml"
}

resource "google_cloudbuild_trigger" "client_default" {
  count = length(local.branches)
  name = "client-trigger-${local.branches[count.index]}"
  github {
    owner = "XateroX"
    name  = "OnlineGame"
    push {
      branch = "^${local.branches[count.index]}$"
    }
  }
  filename = "online-game/cloudbuild.yaml"
}

resource "google_cloud_run_service" "server_default" {
  count    = length(local.branches)
  name     = "image-${local.branches[count.index]}"
  location = "europe-west2"

  template {
    spec {
      containers {
        image = "europe-west2-docker.pkg.dev/dp-rct-dev/online-game/image:${local.branches[count.index]}"

        env {
          name  = "CLIENT_BASE_URL"
          value = local.client_urls[local.branches[count.index]]
        }

        env {
          name  = "VITE_SERVER_URL"
          value = local.server_urls[local.branches[count.index]]
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "client_default" {
  count    = length(local.branches)
  name     = "client-image-${local.branches[count.index]}"
  location = "europe-west2"

  template {
    spec {
      containers {
        image = "europe-west2-docker.pkg.dev/dp-rct-dev/online-game/client-image:${local.branches[count.index]}"

        env {
          name  = "CLIENT_BASE_URL"
          value = local.client_urls[local.branches[count.index]]
        }

        env {
          name  = "VITE_SERVER_URL"
          value = local.server_urls[local.branches[count.index]]
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
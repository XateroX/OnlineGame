locals {
  branches = ["dev", "test", "prod"]
}

provider "google" {
  project = "dp-rct-dev"
  region  = "europe-west2"
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
  name = "trigger-${local.branches[count.index]}"
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
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}
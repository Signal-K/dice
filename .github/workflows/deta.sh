name: Push to Space
on: push

jobs:
  push-to-space:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deta Space Deployment Github Action
        uses: neobrains/space-deployment-github-action@v0.5
        with:
          access_token: ${{ secrets.ACCESS_TOKEN }}
          project_id: ${{ secrets.PROJECT_ID }}
          space_push: true
          list_on_discovery: true
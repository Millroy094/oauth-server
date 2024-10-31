#!/bin/bash

# Variables
SERVICE_NAME="oauth-server-service"     # Update if your service name is different
SERVICE_NAMESPACE="default"             # Update if the service is in a different namespace
RETRIES=10                              # Number of retries
SLEEP_INTERVAL=30                       # Time to wait between retries (in seconds)

# Check if the service exists and is of type LoadBalancer
SERVICE_TYPE=$(kubectl get svc $SERVICE_NAME -n $SERVICE_NAMESPACE -o jsonpath='{.spec.type}' 2>/dev/null)

if [ "$SERVICE_TYPE" != "LoadBalancer" ]; then
  echo "Error: Service $SERVICE_NAME is not of type LoadBalancer or does not exist."
  exit 1
fi

# Wait for LoadBalancer hostname to become available
echo "Waiting for LoadBalancer hostname..."
for ((i=1; i<=RETRIES; i++)); do
  LB_HOST=$(kubectl get svc $SERVICE_NAME -n $SERVICE_NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null)

  if [ -n "$LB_HOST" ]; then
    echo "LoadBalancer Host found: $LB_HOST"
    # Output to GitHub Actions' GITHUB_OUTPUT
    echo "lb_host=$LB_HOST" >> "$GITHUB_OUTPUT"
    exit 0
  else
    echo "Attempt $i/$RETRIES: LoadBalancer hostname not available. Retrying in $SLEEP_INTERVAL seconds..."
    sleep $SLEEP_INTERVAL
  fi
done

# Final check if hostname was not obtained within the retries
echo "Error: LoadBalancer hostname was not assigned within the expected time."
exit 1

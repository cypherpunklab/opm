#!/bin/bash
port=${1:-8080}
ord -r --index-sats server --http-port $port

#!/bin/bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sabq.ai","password":"Test@123456"}' \
  | python3 -m json.tool

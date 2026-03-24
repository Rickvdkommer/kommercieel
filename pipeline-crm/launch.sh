#\!/bin/bash
PORT=3001
export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH
cd /Users/rickvandenkommer/Desktop/kommercieel/pipeline-crm
if lsof -ti:$PORT >/dev/null 2>&1; then
    open "http://localhost:$PORT"
    exit 0
fi
nohup npm run dev -- -p $PORT > /tmp/kommercieel-crm.log 2>&1 &
disown
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30; do
    if curl -s "http://localhost:$PORT" >/dev/null 2>&1; then
        open "http://localhost:$PORT"
        exit 0
    fi
    sleep 1
done
exit 0

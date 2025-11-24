#!/bin/sh

# Map feature names to routes
case "$FEATURE_NAME" in
  dashboard)
    ROUTE="/dashboard"
    ;;
  courses)
    ROUTE="/courses"
    ;;
  skills-assessment)
    ROUTE="/skills-assessment"
    ;;
  career-path)
    ROUTE="/career-path"
    ;;
  market-insights)
    ROUTE="/market-insights"
    ;;
  interview-prep)
    ROUTE="/interview-prep"
    ;;
  career-goals)
    ROUTE="/career-goals"
    ;;
  leaderboard)
    ROUTE="/leaderboard"
    ;;
  profile)
    ROUTE="/profile"
    ;;
  *)
    ROUTE="/"
    ;;
esac

# Generate nginx config with redirect to specific route
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Rewrite root to specific feature route (internal rewrite, keeps port)
    location = / {
        rewrite ^.*$ $ROUTE last;
    }

    # Serve static files
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

echo "✅ Configured nginx to redirect to: $ROUTE"

# Inject redirect script into index.html if route is not root
if [ "$ROUTE" != "/" ]; then
  # Escape the route for sed
  ESCAPED_ROUTE=$(echo "$ROUTE" | sed 's/\//\\\//g')
  # Inject redirect script before closing </head> tag
  sed -i "s|</head>|<script>if(window.location.pathname === '/'){window.location.replace('$ESCAPED_ROUTE');}</script></head>|" /usr/share/nginx/html/index.html
  echo "✅ Injected redirect script to redirect / to $ROUTE"
fi

# Start nginx
exec nginx -g "daemon off;"


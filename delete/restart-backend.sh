# 🔧 Script de redémarrage rapide

echo "🔄 Redémarrage du backend avec nouvelles routes API..."

# Redémarrer le backend pour prendre en compte les nouvelles routes
docker-compose restart backend

echo "⏳ Attente démarrage backend..."
sleep 10

# Vérifier le statut
echo "📊 Test des nouvelles routes API..."
curl -s http://localhost:3001/api/v1/health || echo "❌ Backend non accessible"
curl -s http://localhost:3001/api/v1/grades/me/recent || echo "❌ Route grades non accessible"

echo "✅ Redémarrage terminé. Vérifiez l'interface frontend."

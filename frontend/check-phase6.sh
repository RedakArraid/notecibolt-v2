#!/bin/bash

echo "🧪 Test complet des imports Phase 6"
echo "==================================="

cd /Users/kader/Desktop/projet-en-cours/notecibolt-v2/frontend

echo "📋 Vérification des fichiers critiques..."

# Vérifier les dashboards
echo "✅ Dashboards :"
ls -la src/components/Admin/AdminDashboard.tsx 2>/dev/null && echo "  ✅ AdminDashboard" || echo "  ❌ AdminDashboard"
ls -la src/components/Teacher/TeacherDashboard.tsx 2>/dev/null && echo "  ✅ TeacherDashboard" || echo "  ❌ TeacherDashboard"
ls -la src/components/Parent/ParentDashboard.tsx 2>/dev/null && echo "  ✅ ParentDashboard" || echo "  ❌ ParentDashboard"
ls -la src/components/Supervisor/SupervisorDashboard.tsx 2>/dev/null && echo "  ✅ SupervisorDashboard" || echo "  ❌ SupervisorDashboard"
ls -la src/components/Dashboard/StudentDashboard.tsx 2>/dev/null && echo "  ✅ StudentDashboard" || echo "  ❌ StudentDashboard"

echo ""
echo "✅ Composants Phase 6 :"
ls -la src/components/Error/ErrorBoundary.tsx 2>/dev/null && echo "  ✅ ErrorBoundary" || echo "  ❌ ErrorBoundary"
ls -la src/components/Loading/LoadingComponents.tsx 2>/dev/null && echo "  ✅ LoadingComponents" || echo "  ❌ LoadingComponents"
ls -la src/components/Fallback/ComingSoon.tsx 2>/dev/null && echo "  ✅ ComingSoon" || echo "  ❌ ComingSoon"

echo ""
echo "✅ Utils :"
ls -la src/utils/performance.ts 2>/dev/null && echo "  ✅ performance.ts" || echo "  ❌ performance.ts"
ls -la src/utils/lazyComponents.tsx 2>/dev/null && echo "  ✅ lazyComponents.tsx" || echo "  ❌ lazyComponents.tsx"

echo ""
echo "✅ Store et Router :"
ls -la src/store/index.ts 2>/dev/null && echo "  ✅ Store Zustand" || echo "  ❌ Store Zustand"
ls -la src/router/AppRouter.tsx 2>/dev/null && echo "  ✅ AppRouter" || echo "  ❌ AppRouter"
ls -la src/router/ProtectedRoute.tsx 2>/dev/null && echo "  ✅ ProtectedRoute" || echo "  ❌ ProtectedRoute"

echo ""
echo "🔍 Test de compilation TypeScript..."
npx tsc --noEmit --skipLibCheck

if [ $? -eq 0 ]; then
    echo "✅ Compilation TypeScript réussie"
else
    echo "❌ Erreurs TypeScript détectées"
fi

echo ""
echo "🚀 Prêt à démarrer l'application !"
echo "   npm run dev"

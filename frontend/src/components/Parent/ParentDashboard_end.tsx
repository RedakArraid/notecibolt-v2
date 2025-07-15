          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Messages récents
          </h3>
          <div className="space-y-4">
            {messages.slice(0, 3).map((message) => (
              <div key={message.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`font-medium text-gray-900 dark:text-white ${!message.read ? 'font-bold' : ''}`}>
                        {message.from}
                      </div>
                      {message.urgent && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                          Urgent
                        </span>
                      )}
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white mt-1">
                      {message.subject}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {message.preview}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {new Date(message.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Informations financières */}
      {financialInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Situation financière
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(financialInfo.balance)}
              </div>
              <div className={`text-sm ${financialInfo.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {financialInfo.balance < 0 ? 'Solde débiteur' : 'Solde créditeur'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatAmount(financialInfo.pendingAmount)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Montant à payer
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatAmount(financialInfo.lastPayment.amount)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Dernier paiement ({new Date(financialInfo.lastPayment.date).toLocaleDateString()})
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date(financialInfo.nextDueDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Prochaine échéance
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Contacter école
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Nouveau message
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Prendre RDV
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Enseignants
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Effectuer paiement
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Frais scolaires
              </div>
            </div>
          </button>

          <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                Télécharger bulletin
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Trimestre actuel
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Bannière info v2 avec connexion BDD */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">
              ✅ ParentDashboard v2 : Interface complète + Connexion base de données
            </h4>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Dashboard parent avec suivi multi-enfants, notes, présences, finances - Connecté PostgreSQL avec fallback
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

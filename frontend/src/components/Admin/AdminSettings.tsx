import React, { useState } from 'react';
import { Tabs, Tab, Switch, TextField, Button, FormControlLabel, Chip } from '@mui/material';

const PARAM_TABS = [
  { label: 'Sécurité', key: 'security' },
  { label: 'Utilisateurs & Profils', key: 'users' },
  { label: 'Communication', key: 'communication' },
  { label: 'Données', key: 'data' },
  { label: 'Espaces web', key: 'web' },
  { label: 'Maintenance', key: 'maintenance' },
];

// Mock API (remplacer par un vrai service plus tard)
const saveSecuritySettings = async (params: any) => {
  return new Promise(resolve => setTimeout(() => resolve({ success: true, data: params }), 800));
};

export const AdminSettings: React.FC = () => {
  const [tab, setTab] = useState('security');

  // Sécurité : états locaux
  const [ipWhitelist, setIpWhitelist] = useState<string[]>([]);
  const [ipBlacklist, setIpBlacklist] = useState<string[]>([]);
  const [ipInput, setIpInput] = useState('');
  const [ipMode, setIpMode] = useState<'whitelist' | 'blacklist'>('whitelist');
  const [twoFA, setTwoFA] = useState(false);
  const [maxConnections, setMaxConnections] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleAddIp = () => {
    if (!ipInput.trim()) return;
    if (ipMode === 'whitelist' && !ipWhitelist.includes(ipInput)) {
      setIpWhitelist([...ipWhitelist, ipInput]);
    } else if (ipMode === 'blacklist' && !ipBlacklist.includes(ipInput)) {
      setIpBlacklist([...ipBlacklist, ipInput]);
    }
    setIpInput('');
  };
  const handleDeleteIp = (ip: string, mode: 'whitelist' | 'blacklist') => {
    if (mode === 'whitelist') setIpWhitelist(ipWhitelist.filter(i => i !== ip));
    else setIpBlacklist(ipBlacklist.filter(i => i !== ip));
  };
  const handleSaveSecurity = async () => {
    setSaving(true);
    setSaveMsg(null);
    const params = {
      ipWhitelist,
      ipBlacklist,
      twoFA,
      maxConnections
    };
    const res: any = await saveSecuritySettings(params);
    setSaving(false);
    setSaveMsg(res.success ? 'Paramètres enregistrés !' : 'Erreur lors de la sauvegarde');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres de l'établissement</h1>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Paramètres admin"
        sx={{ marginBottom: 3 }}
      >
        {PARAM_TABS.map(t => (
          <Tab key={t.key} label={t.label} value={t.key} />
        ))}
      </Tabs>
      <div className="mt-6">
        {tab === 'security' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sécurité & Contrôle d'accès</h2>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant={ipMode === 'whitelist' ? 'contained' : 'outlined'}
                  onClick={() => setIpMode('whitelist')}
                  size="small"
                >Whitelist</Button>
                <Button
                  variant={ipMode === 'blacklist' ? 'contained' : 'outlined'}
                  onClick={() => setIpMode('blacklist')}
                  size="small"
                >Blacklist</Button>
                <TextField
                  label="Adresse IP"
                  value={ipInput}
                  onChange={e => setIpInput(e.target.value)}
                  size="small"
                  sx={{ width: 180 }}
                  onKeyDown={e => e.key === 'Enter' && handleAddIp()}
                />
                <Button variant="contained" onClick={handleAddIp} size="small">Ajouter</Button>
              </div>
              <div className="flex gap-8 mt-2">
                <div>
                  <div className="font-semibold mb-1">Whitelist</div>
                  {ipWhitelist.length === 0 && <div className="text-gray-400 text-sm">Aucune IP</div>}
                  {ipWhitelist.map(ip => (
                    <Chip key={ip} label={ip} onDelete={() => handleDeleteIp(ip, 'whitelist')} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </div>
                <div>
                  <div className="font-semibold mb-1">Blacklist</div>
                  {ipBlacklist.length === 0 && <div className="text-gray-400 text-sm">Aucune IP</div>}
                  {ipBlacklist.map(ip => (
                    <Chip key={ip} label={ip} onDelete={() => handleDeleteIp(ip, 'blacklist')} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <FormControlLabel
                control={<Switch checked={twoFA} onChange={e => setTwoFA(e.target.checked)} />}
                label="Activer la double authentification (2FA) pour les connexions sensibles"
              />
            </div>
            <div className="mb-6">
              <TextField
                label="Nombre maximal de connexions simultanées"
                type="number"
                value={maxConnections}
                onChange={e => setMaxConnections(Number(e.target.value))}
                size="small"
                sx={{ width: 320 }}
                inputProps={{ min: 1, max: 100 }}
              />
            </div>
            <Button variant="contained" color="primary" onClick={handleSaveSecurity} disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            {saveMsg && <div className="mt-2 text-green-600">{saveMsg}</div>}
          </div>
        )}
        {/* Les autres onglets restent à brancher */}
        {tab === 'users' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Utilisateurs & Profils</h2>
            <p>Paramètres utilisateurs à implémenter ici.</p>
          </div>
        )}
        {tab === 'communication' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Communication & Messagerie</h2>
            <p>Paramètres de communication à implémenter ici.</p>
          </div>
        )}
        {tab === 'data' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Données & Synchronisation</h2>
            <p>Paramètres de données à implémenter ici.</p>
          </div>
        )}
        {tab === 'web' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Espaces web & Personnalisation</h2>
            <p>Paramètres web à implémenter ici.</p>
          </div>
        )}
        {tab === 'maintenance' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Maintenance & Supervision</h2>
            <p>Paramètres de maintenance à implémenter ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
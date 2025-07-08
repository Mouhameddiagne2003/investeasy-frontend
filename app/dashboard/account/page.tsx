"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Save,
  Server,
  Shield,
  Mail,
  Database,
  Bell,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();

  // États pour les différentes sections de paramètres
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'InvestEasy',
    siteDescription: "Plateforme d'apprentissage en investissement",
    adminEmail: 'admin@investeasy.com',
    supportEmail: 'support@investeasy.com',
    maintenanceMode: false,
    registrationEnabled: true
  });

  const [apiSettings, setApiSettings] = useState({
    apiBaseUrl: 'http://localhost:8080/api',
    apiTimeout: '10000',
    rateLimitEnabled: true,
    maxRequestsPerMinute: '60'
  });

  const [securitySettings, setSecuritySettings] = useState({
    jwtExpirationTime: '24h',
    passwordMinLength: '8',
    requireEmailVerification: true,
    twoFactorEnabled: false,
    sessionTimeout: '30'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    emailFromName: 'InvestEasy',
    emailFromAddress: 'noreply@investeasy.com'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserNotifications: true,
    newCommentNotifications: true,
    systemAlerts: true,
    weeklyReports: true
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '30',
    compressionEnabled: true
  });

  const handleSaveSection = (section: string) => {
    toast({
      title: 'Paramètres sauvegardés',
      description: `Les paramètres de ${section} ont été sauvegardés avec succès.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Paramètres système</h2>
        <p className="text-muted-foreground mt-1">
          Configurez les paramètres généraux et techniques de votre plateforme
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            API
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de données
          </TabsTrigger>
        </TabsList>

        {/* Paramètres généraux */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Paramètres généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      siteName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email administrateur</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={(e) => setGeneralSettings({
                      ...generalSettings,
                      adminEmail: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description du site</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    siteDescription: e.target.value
                  })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    supportEmail: e.target.value
                  })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Activez pour désactiver temporairement l'accès au site
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      maintenanceMode: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registrationEnabled">Inscriptions ouvertes</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux nouveaux utilisateurs de s'inscrire
                    </p>
                  </div>
                  <Switch
                    id="registrationEnabled"
                    checked={generalSettings.registrationEnabled}
                    onCheckedChange={(checked) => setGeneralSettings({
                      ...generalSettings,
                      registrationEnabled: checked
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSection('généraux')} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres généraux
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres API */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Configuration API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiBaseUrl">URL de base de l'API</Label>
                  <Input
                    id="apiBaseUrl"
                    value={apiSettings.apiBaseUrl}
                    onChange={(e) => setApiSettings({
                      ...apiSettings,
                      apiBaseUrl: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiTimeout">Timeout API (ms)</Label>
                  <Input
                    id="apiTimeout"
                    type="number"
                    value={apiSettings.apiTimeout}
                    onChange={(e) => setApiSettings({
                      ...apiSettings,
                      apiTimeout: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="rateLimitEnabled">Limitation de débit</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer la limitation du nombre de requêtes par minute
                  </p>
                </div>
                <Switch
                  id="rateLimitEnabled"
                  checked={apiSettings.rateLimitEnabled}
                  onCheckedChange={(checked) => setApiSettings({
                    ...apiSettings,
                    rateLimitEnabled: checked
                  })}
                />
              </div>

              {apiSettings.rateLimitEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="maxRequestsPerMinute">Requêtes max par minute</Label>
                  <Input
                    id="maxRequestsPerMinute"
                    type="number"
                    value={apiSettings.maxRequestsPerMinute}
                    onChange={(e) => setApiSettings({
                      ...apiSettings,
                      maxRequestsPerMinute: e.target.value
                    })}
                  />
                </div>
              )}

              <Button onClick={() => handleSaveSection('API')} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres API
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres de sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jwtExpiration">Expiration JWT</Label>
                  <Select
                    value={securitySettings.jwtExpirationTime}
                    onValueChange={(value) => setSecuritySettings({
                      ...securitySettings,
                      jwtExpirationTime: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 heure</SelectItem>
                      <SelectItem value="24h">24 heures</SelectItem>
                      <SelectItem value="7d">7 jours</SelectItem>
                      <SelectItem value="30d">30 jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Longueur min. mot de passe</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      passwordMinLength: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de session (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => setSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: e.target.value
                  })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Vérification email obligatoire</Label>
                    <p className="text-sm text-muted-foreground">
                      Exiger la vérification email lors de l'inscription
                    </p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={securitySettings.requireEmailVerification}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      requireEmailVerification: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorEnabled">Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer l'A2F pour les comptes administrateurs
                    </p>
                  </div>
                  <Switch
                    id="twoFactorEnabled"
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorEnabled: checked
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSection('sécurité')} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres de sécurité
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuration email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">Serveur SMTP</Label>
                  <Input
                    id="smtpHost"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpHost: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port SMTP</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpPort: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">Nom d'utilisateur SMTP</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpUsername: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      smtpPassword: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailFromName">Nom expéditeur</Label>
                  <Input
                    id="emailFromName"
                    value={emailSettings.emailFromName}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      emailFromName: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailFromAddress">Adresse expéditeur</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={emailSettings.emailFromAddress}
                    onChange={(e) => setEmailSettings({
                      ...emailSettings,
                      emailFromAddress: e.target.value
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSection('email')} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres des notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Activer l'envoi de notifications par email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newUserNotifications">Nouveaux utilisateurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification lors de nouvelles inscriptions
                    </p>
                  </div>
                  <Switch
                    id="newUserNotifications"
                    checked={notificationSettings.newUserNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      newUserNotifications: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newCommentNotifications">Nouveaux commentaires</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification pour les nouveaux commentaires
                    </p>
                  </div>
                  <Switch
                    id="newCommentNotifications"
                    checked={notificationSettings.newCommentNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      newCommentNotifications: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts">Alertes système</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les alertes critiques du système
                    </p>
                  </div>
                  <Switch
                    id="systemAlerts"
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      systemAlerts: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weeklyReports">Rapports hebdomadaires</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un rapport d'activité chaque semaine
                    </p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: checked
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSection('notifications')} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres de notifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres base de données */}
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuration base de données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Sauvegarde automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les sauvegardes automatiques de la base de données
                  </p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={databaseSettings.autoBackup}
                  onCheckedChange={(checked) => setDatabaseSettings({
                    ...databaseSettings,
                    autoBackup: checked
                  })}
                />
              </div>

              {databaseSettings.autoBackup && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                    <Select
                      value={databaseSettings.backupFrequency}
                      onValueChange={(value) => setDatabaseSettings({
                        ...databaseSettings,
                        backupFrequency: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retentionPeriod">Période de rétention (jours)</Label>
                    <Input
                      id="retentionPeriod"
                      type="number"
                      value={databaseSettings.retentionPeriod}
                      onChange={(e) => setDatabaseSettings({
                        ...databaseSettings,
                        retentionPeriod: e.target.value
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compressionEnabled">Compression des sauvegardes</Label>
                      <p className="text-sm text-muted-foreground">
                        Compresser les fichiers de sauvegarde pour économiser l'espace
                      </p>
                    </div>
                    <Switch
                      id="compressionEnabled"
                      checked={databaseSettings.compressionEnabled}
                      onCheckedChange={(checked) => setDatabaseSettings({
                        ...databaseSettings,
                        compressionEnabled: checked
                      })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSaveSection('base de données')}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les paramètres
                </Button>
                <Button variant="outline" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Créer une sauvegarde maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;

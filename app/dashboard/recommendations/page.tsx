"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { TrendingUp, Target, Shield, DollarSign, AlertCircle } from "lucide-react";

const Recommendations = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [formData, setFormData] = useState({
    budget: "",
    goal: "",
    risk: ""
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              Connexion requise
            </CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder aux recommandations personnalisées.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => router.push("/login") } className="w-full">
              Se connecter
            </Button>
            <Button onClick={() => router.push("/register") } variant="outline" className="w-full">
              Créer un compte
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!formData.budget || !formData.goal || !formData.risk) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const budget = parseInt(formData.budget);
      let recommendationResult;
      if (budget < 50000) {
        recommendationResult = {
          type: "Épargne sécurisée",
          description: "Commencez par constituer une épargne de précaution avant d'investir.",
          products: ["Livret d'épargne", "Compte à terme"],
          risk: "Très faible",
          expectedReturn: "2-4% par an",
          advice: "Constituez d'abord un fonds d'urgence équivalent à 3-6 mois de dépenses."
        };
      } else if (budget < 200000) {
        recommendationResult = {
          type: "Obligations et fonds mixtes",
          description: "Diversifiez avec des obligations d'État et des fonds équilibrés.",
          products: ["Obligations du Trésor", "Fonds mixtes", "OPCVM obligataires"],
          risk: formData.risk === "low" ? "Faible" : "Modéré",
          expectedReturn: "4-7% par an",
          advice: "Diversifiez vos investissements pour réduire les risques."
        };
      } else {
        recommendationResult = {
          type: "Portefeuille diversifié",
          description: "Investissement dans un portefeuille diversifié actions/obligations.",
          products: ["Actions BRVM", "Obligations", "Immobilier", "Fonds d'investissement"],
          risk: formData.risk === "high" ? "Élevé" : "Modéré",
          expectedReturn: "6-12% par an",
          advice: "Investissez sur le long terme et rééquilibrez régulièrement votre portefeuille."
        };
      }
      setRecommendation({
        ...recommendationResult,
        budget,
        goal: formData.goal,
        riskProfile: formData.risk
      });
      toast.success("Votre analyse personnalisée est prête");
    } catch (error) {
      toast.error("Impossible de générer la recommandation");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "très faible":
      case "faible":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "modéré":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "élevé":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Recommandations Personnalisées</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Obtenez des conseils d'investissement adaptés à votre profil et vos objectifs financiers.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Votre profil d'investisseur
            </CardTitle>
            <CardDescription>
              Remplissez ce questionnaire pour recevoir des recommandations adaptées à votre situation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget d'investissement (FCFA)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Ex: 100000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                Montant que vous souhaitez investir
              </p>
            </div>
            {/* Goal */}
            <div className="space-y-2">
              <Label>Objectif d'investissement</Label>
              <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retirement">Retraite</SelectItem>
                  <SelectItem value="housing">Achat immobilier</SelectItem>
                  <SelectItem value="education">Éducation des enfants</SelectItem>
                  <SelectItem value="savings">Épargne générale</SelectItem>
                  <SelectItem value="business">Création d'entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Risk Tolerance */}
            <div className="space-y-3">
              <Label>Tolérance au risque</Label>
              <RadioGroup 
                value={formData.risk} 
                onValueChange={(value) => setFormData({ ...formData, risk: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Faible</div>
                      <div className="text-sm text-muted-foreground">
                        Je préfère la sécurité, même avec des rendements plus faibles
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Modéré</div>
                      <div className="text-sm text-muted-foreground">
                        J'accepte quelques risques pour de meilleurs rendements
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Élevé</div>
                      <div className="text-sm text-muted-foreground">
                        Je suis prêt à prendre des risques importants
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Analyse en cours..." : "Obtenir mes recommandations"}
            </Button>
          </CardContent>
        </Card>
        {/* Results */}
        <div className="space-y-6">
          {recommendation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Votre recommandation
                </CardTitle>
                <CardDescription>
                  Basée sur votre profil d'investisseur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{recommendation.type}</h3>
                  <p className="text-muted-foreground">{recommendation.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-semibold">
                      {recommendation.budget.toLocaleString()} FCFA
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Rendement attendu</div>
                    <div className="font-semibold text-green-600">
                      {recommendation.expectedReturn}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Niveau de risque</span>
                    <Badge className={getRiskColor(recommendation.risk)}>
                      {recommendation.risk}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Produits recommandés :</h4>
                  <ul className="space-y-1">
                    {recommendation.products.map((product: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <DollarSign className="h-3 w-3 mr-2 text-primary" />
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Conseil personnalisé
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {recommendation.advice}
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Télécharger le rapport complet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune recommandation pour le moment</h3>
                <p className="text-muted-foreground mb-4">
                  Remplissez le formulaire pour obtenir vos recommandations personnalisées.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations; 
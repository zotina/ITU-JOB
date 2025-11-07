import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, CheckCircle, Clock } from 'lucide-react';

const RecruiterAnalytics = () => {
  // Données pour les cards KPI
  const kpiData = [
    { 
      title: "Offres Actives", 
      value: 15, 
      trend: "+3 ce mois", 
      trendUp: true, 
      icon: <FileText className="w-8 h-8" />,
      color: "bg-blue-500"
    },
    { 
      title: "Candidatures En Attente", 
      value: 23, 
      trend: "+5 aujourd'hui", 
      trendUp: true, 
      icon: <Users className="w-8 h-8" />,
      color: "bg-yellow-500"
    },
    { 
      title: "Acceptées Ce Mois", 
      value: 8, 
      trend: "+2 cette semaine", 
      trendUp: true, 
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-green-500"
    },
    { 
      title: "Délai Moyen", 
      value: "12 jours", 
      trend: "-2 jours", 
      trendUp: true, 
      icon: <Clock className="w-8 h-8" />,
      color: "bg-purple-500"
    }
  ];

  // Données pour l'évolution temporelle
  const timelineData = [
    { jour: 'J1', candidatures: 8 },
    { jour: 'J5', candidatures: 12 },
    { jour: 'J10', candidatures: 18 },
    { jour: 'J15', candidatures: 15 },
    { jour: 'J20', candidatures: 25 },
    { jour: 'J25', candidatures: 22 },
    { jour: 'J30', candidatures: 30 }
  ];

  // Données pour le statut (pie chart)
  const statusData = [
    { name: 'En Attente', value: 45, color: '#EAB308' },
    { name: 'Acceptées', value: 30, color: '#22C55E' },
    { name: 'Refusées', value: 25, color: '#EF4444' }
  ];

  // Données pour les top offres
  const topOffersData = [
    { offre: 'Développeur Full-Stack', candidatures: 18 },
    { offre: 'Data Analyst', candidatures: 12 },
    { offre: 'Designer UI/UX', candidatures: 10 },
    { offre: 'Chef de Projet', candidatures: 8 },
    { offre: 'Développeur Mobile', candidatures: 6 }
  ];

  // Dernières candidatures
  const recentApplications = [
    { candidat: 'Jean D.', offre: 'Dev Full-Stack', date: 'Il y a 2h', matching: 92 },
    { candidat: 'Marie L.', offre: 'Data Analyst', date: 'Il y a 5h', matching: 85 },
    { candidat: 'Paul K.', offre: 'Designer UX', date: 'Hier', matching: 78 },
    { candidat: 'Sophie M.', offre: 'Dev Mobile', date: 'Hier', matching: 71 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard Recruteur</h1>
          <p className="text-slate-600">Vue d'ensemble de vos activités de recrutement</p>
        </div>

        {/* Cards KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${kpi.color} text-white p-3 rounded-lg`}>
                  {kpi.icon}
                </div>
                {kpi.trendUp ? 
                  <TrendingUp className="w-5 h-5 text-green-500" /> : 
                  <TrendingDown className="w-5 h-5 text-red-500" />
                }
              </div>
              <h3 className="text-slate-600 text-sm font-medium mb-1">{kpi.title}</h3>
              <p className="text-3xl font-bold text-slate-800 mb-2">{kpi.value}</p>
              <p className={`text-sm ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Taux de conversion */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Taux de Conversion Global</h2>
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-800">78%</span>
                </div>
              </div>
              <p className="mt-4 text-green-600 font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Objectif: 75% - Atteint!
              </p>
            </div>
          </div>

          {/* Évolution des candidatures */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Candidatures Reçues (30 derniers jours)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="jour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="candidatures" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-4 text-sm text-slate-600">
              📈 Total: <span className="font-bold text-slate-800">245</span> (+12% vs mois précédent)
            </p>
          </div>

          {/* Statut des candidatures */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Statut des Candidatures</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                En attente: 23
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                Acceptées: 15
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                Refusées: 13
              </span>
            </div>
          </div>

          {/* Top offres */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Offres les Plus Populaires</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topOffersData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="offre" type="category" width={130} stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="candidatures" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-sm text-slate-600">
              💡 <span className="font-semibold">"Développeur Full-Stack"</span> a le meilleur taux de matching!
            </p>
          </div>
        </div>

        {/* Tableau des dernières candidatures */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Dernières Candidatures</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Candidat</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Offre</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-slate-600 font-semibold">Matching</th>
                  <th className="text-center py-3 px-4 text-slate-600 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{app.candidat}</td>
                    <td className="py-3 px-4 text-slate-600">{app.offre}</td>
                    <td className="py-3 px-4 text-slate-500 text-sm">{app.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        app.matching >= 85 ? 'text-green-600' : 
                        app.matching >= 70 ? 'text-blue-600' : 'text-slate-600'
                      }`}>
                        {app.matching}%
                        {app.matching >= 85 && <span>⭐</span>}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                        Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterAnalytics;
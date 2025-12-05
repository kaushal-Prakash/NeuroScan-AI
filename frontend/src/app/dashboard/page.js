"use client";
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  BarChart3, 
  Activity,
  Download,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        // In a real app, you would fetch this from your API
        const userData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/get-user`, {
          withCredentials: true,
        });
        const userResults = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results/get-user-results`, {
          withCredentials: true,
        });
        console.log(userResults.data);
        setUser(userData.data.user);
        setResults(userResults.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setResults([]); // Ensure results is always an array
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Prepare data for the chart - fixed to handle empty results
  const chartData = {
    labels: results.length > 0 
      ? results.map(result => 
          new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        )
      : [],
    datasets: [
      {
        label: 'COVID-19',
        data: results.length > 0 
          ? results.map(result => result.case === 'covid' ? result.confidence * 100 : 0)
          : [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Viral Pneumonia',
        data: results.length > 0 
          ? results.map(result => result.case === 'viral' ? result.confidence * 100 : 0)
          : [],
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
      },
      {
        label: 'Normal',
        data: results.length > 0 
          ? results.map(result => result.case === 'normal' ? result.confidence * 100 : 0)
          : [],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Scan Results History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Confidence %'
        }
      },
    },
  };

  // Calculate statistics - these will work with empty array
  const totalScans = results.length;
  const covidScans = results.filter(r => r.case === 'covid').length;
  const normalScans = results.filter(r => r.case === 'normal').length;
  const viralScans = results.filter(r => r.case === 'viral').length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-gray-600">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-gray-600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Type</p>
                    <Badge variant={user?.isPremium ? "default" : "secondary"} className="mt-1">
                      {user?.isPremium ? "Premium" : "Free Tier"}
                    </Badge>
                  </div>
                </div>

                {!user?.isPremium && (
                  <Button className="w-full mt-4" onClick={() => window.location.href = '/pricing'}>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Scan Statistics
              </CardTitle>
              <CardDescription>
                Overview of your COVID-19 detection scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold">{totalScans}</p>
                  <p className="text-sm text-gray-600">Total Scans</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold">{covidScans}</p>
                  <p className="text-sm text-gray-600">COVID Detections</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold">{normalScans}</p>
                  <p className="text-sm text-gray-600">Normal Results</p>
                </div>
              </div>

              {totalScans > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">COVID Detections</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((covidScans / totalScans) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(covidScans / totalScans) * 100} 
                    className="h-2"
                    indicatorClassName="bg-red-500"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium">Viral Pneumonia</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((viralScans / totalScans) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(viralScans / totalScans) * 100} 
                    className="h-2"
                    indicatorClassName="bg-yellow-500"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium">Normal Results</span>
                    <span className="text-sm text-gray-600">
                      {Math.round((normalScans / totalScans) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(normalScans / totalScans) * 100} 
                    className="h-2"
                    indicatorClassName="bg-green-500"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No scan data available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start by analyzing your first X-ray image</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results History with Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Scan History
                </CardTitle>
                <CardDescription>
                  Your recent COVID-19 detection scan results
                </CardDescription>
              </div>
              {/* {results.length > 0 && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              )} */}
            </div>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-6">
                <div className="h-80">
                  <Bar options={chartOptions} data={chartData} />
                </div>

                <div>
                  <h3 className="font-medium mb-3">Recent Scans</h3>
                  <div className="space-y-3">
                    {results.slice(0, 3).map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            result.case === 'covid' ? 'bg-red-100' : 
                            result.case === 'viral' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            <Activity className={`h-4 w-4 ${
                              result.case === 'covid' ? 'text-red-600' : 
                              result.case === 'viral' ? 'text-yellow-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{result.case.charAt(0).toUpperCase() + result.case.slice(1)}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(result.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          result.case === 'covid' ? 'destructive' : 
                          result.case === 'viral' ? 'secondary' : 'default'
                        }>
                          {Math.round(result.confidence * 100)}% confidence
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-1">No scan history yet</h3>
                <p className="text-gray-500 mb-4">Start by analyzing your first X-ray image</p>
                <Button onClick={() => window.location.href = '/services'}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
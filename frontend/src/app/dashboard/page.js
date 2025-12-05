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
  PlusCircle,
  Brain,
  FileText,
  TrendingUp,
  RefreshCw
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
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState(''); // Track where results came from

  const fetchUserData = async () => {
    try {
      // Get user data from Node.js backend
      const userData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/get-user`, {
        withCredentials: true,
      });
      setUser(userData.data.user);
      
      let allResults = [];
      let resultSource = '';
      
      // Try to get results from Flask MongoDB first
      try {
        const userId = userData.data.user?._id || "demo_user";
        const flaskResults = await axios.get(
          "http://127.0.0.1:5000/api/user/results",
          {
            headers: {
              "X-User-Id": userId
            }
          }
        );
        
        if (flaskResults.data.status === "success" && flaskResults.data.results.length > 0) {
          console.log(`✅ Found ${flaskResults.data.results.length} results from Flask MongoDB`);
          allResults = flaskResults.data.results.map(result => ({
            ...result,
            _id: result._id || result.id,
            case: result.case || result.tumor_type,
            confidence: result.confidence || 0,
            date: result.date || result.createdAt,
            tumorType: result.tumorType || result.diagnosis
          }));
          resultSource = 'flask';
        }
      } catch (flaskError) {
        console.log("⚠️ Could not fetch from Flask MongoDB:", flaskError.message);
      }
      
      // If no Flask results, try Node.js backend
      if (allResults.length === 0) {
        try {
          const nodeResults = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results/get-user-results`, {
            withCredentials: true,
          });
          
          if (nodeResults.data && nodeResults.data.length > 0) {
            console.log(`✅ Found ${nodeResults.data.length} results from Node.js MongoDB`);
            allResults = nodeResults.data;
            resultSource = 'nodejs';
          }
        } catch (nodeError) {
          console.log("⚠️ Could not fetch from Node.js MongoDB:", nodeError.message);
        }
      }
      
      // If still no results, show mock data for demo
      if (allResults.length === 0) {
        console.log("⚠️ No results found, showing mock data");
        allResults = getMockResults();
        resultSource = 'mock';
      }
      
      setResults(allResults);
      setSource(resultSource);
      
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // Show mock data on error
      setResults(getMockResults());
      setSource('mock');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Helper function for mock data
  const getMockResults = () => {
    const now = new Date();
    return [
      {
        _id: "1",
        case: "pituitary",
        confidence: 0.94,
        date: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tumorType: "Pituitary Tumor",
        imageUrl: "https://via.placeholder.com/300x300/3B82F6/ffffff?text=Pituitary"
      },
      {
        _id: "2",
        case: "glioma",
        confidence: 0.87,
        date: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tumorType: "Glioma Tumor",
        imageUrl: "https://via.placeholder.com/300x300/8B5CF6/ffffff?text=Glioma"
      },
      {
        _id: "3",
        case: "notumor",
        confidence: 0.96,
        date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tumorType: "No Tumor",
        imageUrl: "https://via.placeholder.com/300x300/6B7280/ffffff?text=No+Tumor"
      }
    ];
  };

  // Prepare data for tumor classification chart
  const chartData = {
    labels: results.length > 0 
      ? results.map(result => 
          new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        )
      : [],
    datasets: [
      {
        label: 'Pituitary Tumor',
        data: results.length > 0 
          ? results.map(result => result.case === 'pituitary' ? (result.confidence || 0) * 100 : 0)
          : [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
      },
      {
        label: 'Glioma Tumor',
        data: results.length > 0 
          ? results.map(result => result.case === 'glioma' ? (result.confidence || 0) * 100 : 0)
          : [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)', // Purple
      },
      {
        label: 'Meningioma Tumor',
        data: results.length > 0 
          ? results.map(result => result.case === 'meningioma' ? (result.confidence || 0) * 100 : 0)
          : [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Green
      },
      {
        label: 'No Tumor',
        data: results.length > 0 
          ? results.map(result => result.case === 'notumor' ? (result.confidence || 0) * 100 : 0)
          : [],
        backgroundColor: 'rgba(107, 114, 128, 0.8)', // Gray
      },
    ],
  };

  // Doughnut chart data for tumor distribution
  const doughnutData = {
    labels: ['Pituitary', 'Glioma', 'Meningioma', 'No Tumor'],
    datasets: [
      {
        data: [
          results.filter(r => (r.case || '').toLowerCase() === 'pituitary').length,
          results.filter(r => (r.case || '').toLowerCase() === 'glioma').length,
          results.filter(r => (r.case || '').toLowerCase() === 'meningioma').length,
          results.filter(r => (r.case || '').toLowerCase() === 'notumor').length
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ],
        borderWidth: 1,
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
        text: 'Brain MRI Scan Results History',
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

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Tumor Distribution',
      },
    },
  };

  // Calculate statistics
  const totalScans = results.length;
  const tumorScans = results.filter(r => (r.case || '').toLowerCase() !== 'notumor').length;
  const pituitaryScans = results.filter(r => (r.case || '').toLowerCase() === 'pituitary').length;
  const gliomaScans = results.filter(r => (r.case || '').toLowerCase() === 'glioma').length;
  const meningiomaScans = results.filter(r => (r.case || '').toLowerCase() === 'meningioma').length;
  const noTumorScans = results.filter(r => (r.case || '').toLowerCase() === 'notumor').length;
  const detectionRate = totalScans > 0 ? Math.round((tumorScans / totalScans) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading your scan history...</p>
      </div>
    );
  }

  const getCaseDisplayName = (caseType) => {
    const caseStr = (caseType || '').toLowerCase();
    switch(caseStr) {
      case 'pituitary': return 'Pituitary Tumor';
      case 'glioma': return 'Glioma Tumor';
      case 'meningioma': return 'Meningioma Tumor';
      case 'notumor': return 'No Tumor';
      default: return caseType || 'Unknown';
    }
  };

  const getCaseColor = (caseType) => {
    const caseStr = (caseType || '').toLowerCase();
    switch(caseStr) {
      case 'pituitary': return 'bg-blue-100 text-blue-800';
      case 'glioma': return 'bg-purple-100 text-purple-800';
      case 'meningioma': return 'bg-green-100 text-green-800';
      case 'notumor': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCaseBadgeVariant = (caseType) => {
    const caseStr = (caseType || '').toLowerCase();
    switch(caseStr) {
      case 'pituitary': return 'default';
      case 'glioma': return 'secondary';
      case 'meningioma': return 'outline';
      case 'notumor': return 'destructive';
      default: return 'default';
    }
  };

  const getSourceBadge = () => {
    switch(source) {
      case 'flask':
        return <Badge className="bg-green-600 hover:bg-green-700 ml-2">Flask Database</Badge>;
      case 'nodejs':
        return <Badge className="bg-blue-600 hover:bg-blue-700 ml-2">Node.js Database</Badge>;
      case 'mock':
        return <Badge variant="outline" className="ml-2">Demo Data</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">NeuroScan Dashboard</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUserData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <p className="text-gray-600">
              Welcome back, <span className="font-semibold text-blue-600">{user?.name || 'User'}</span>
            </p>
            {user?.role === 'doctor' && (
              <Badge className="bg-blue-600 hover:bg-blue-700">
                Medical Professional
              </Badge>
            )}
            {getSourceBadge()}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* User Profile Card */}
          <Card className="lg:col-span-1 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-gray-600">{user?.name || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{user?.email || 'Not available'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Member since</p>
                    <p className="text-sm text-gray-600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Crown className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account Type</p>
                    <Badge variant={user?.isPremium ? "default" : "secondary"} className="mt-1">
                      {user?.isPremium ? "Premium" : "Free Tier"}
                    </Badge>
                  </div>
                </div>

                {!user?.isPremium && (
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="lg:col-span-3 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    MRI Scan Statistics
                  </CardTitle>
                  <CardDescription>
                    Overview of your brain tumor detection scans
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {totalScans} total scans
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-2xl font-bold text-blue-700">{totalScans}</p>
                  <p className="text-sm text-blue-600 font-medium">Total Scans</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p className="text-2xl font-bold text-purple-700">{tumorScans}</p>
                  <p className="text-sm text-purple-600 font-medium">Tumor Detections</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <p className="text-2xl font-bold text-green-700">{noTumorScans}</p>
                  <p className="text-sm text-green-600 font-medium">Clear Scans</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                  <p className="text-2xl font-bold text-amber-700">{detectionRate}%</p>
                  <p className="text-sm text-amber-600 font-medium">Detection Rate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Progress bars */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Tumor Type Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-blue-700">Pituitary</span>
                        <span className="text-sm text-gray-600">
                          {totalScans > 0 ? Math.round((pituitaryScans / totalScans) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={(pituitaryScans / totalScans) * 100} 
                        className="h-2"
                        indicatorClassName="bg-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-purple-700">Glioma</span>
                        <span className="text-sm text-gray-600">
                          {totalScans > 0 ? Math.round((gliomaScans / totalScans) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={(gliomaScans / totalScans) * 100} 
                        className="h-2"
                        indicatorClassName="bg-purple-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-green-700">Meningioma</span>
                        <span className="text-sm text-gray-600">
                          {totalScans > 0 ? Math.round((meningiomaScans / totalScans) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={(meningiomaScans / totalScans) * 100} 
                        className="h-2"
                        indicatorClassName="bg-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Doughnut chart */}
                <div className="h-64">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results History with Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Scan History & Analysis
                </CardTitle>
                <CardDescription>
                  Your recent brain MRI scan results and trends
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.location.href = '/services'}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New MRI Scan
                </Button>
                {source === 'mock' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-amber-200 text-amber-600 hover:bg-amber-50"
                    onClick={() => window.location.href = '/services'}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Add Real Scans
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-8">
                {/* Bar Chart */}
                <div className="h-80">
                  <Bar options={chartOptions} data={chartData} />
                </div>

                {/* Recent Scans */}
                <div>
                  <h3 className="font-medium text-lg mb-4">Recent MRI Scans</h3>
                  <div className="space-y-3">
                    {results.slice(0, 5).map((result, index) => (
                      <div 
                        key={result._id || index} 
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${getCaseColor(result.case)}`}>
                            <Brain className={`h-5 w-5 ${
                              (result.case || '').toLowerCase() === 'pituitary' ? 'text-blue-600' : 
                              (result.case || '').toLowerCase() === 'glioma' ? 'text-purple-600' : 
                              (result.case || '').toLowerCase() === 'meningioma' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {getCaseDisplayName(result.case)}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-500">
                                {new Date(result.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-sm text-gray-500">
                                {new Date(result.date).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={getCaseBadgeVariant(result.case)} className="text-sm">
                            {Math.round((result.confidence || 0) * 100)}% confidence
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {results.length > 5 && (
                    <div className="mt-6 text-center">
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/history'}
                      >
                        View All Scans ({results.length})
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                  <Brain className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-lg mb-2">No MRI scans yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start by analyzing your first brain MRI scan to detect tumors with 94% accuracy
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => window.location.href = '/services'}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Analyze First MRI
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
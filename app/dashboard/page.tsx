"use client";
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FiUsers, FiDroplet } from "react-icons/fi";
import { FaFish, FaEgg, FaChartLine } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const { loading, stats, speciesData, spawnsData } = useDashboard();

  // Cores para o gráfico de pizza
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="content-card">
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="loading-text mt-3">Carregando dados do dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <div className="content-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="card-title mb-0">
                <FaChartLine className="me-2 text-primary" /> Dashboard Fisher
                Control
              </h2>
            </div>

            {/* Cards de informações */}
            <Row className="mb-4">
              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                      <FiUsers size={24} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0">Usuários</h6>
                      <h3 className="mb-0">{stats.totalUsers}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                      <FiDroplet size={24} className="text-info" />
                    </div>
                    <div>
                      <h6 className="mb-0">Tanques</h6>
                      <h3 className="mb-0">{stats.totalTanks}</h3>
                      <small className="text-muted">
                        {stats.tankOccupation}% ocupados
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                      <FaFish size={24} className="text-success" />
                    </div>
                    <div>
                      <h6 className="mb-0">Animais</h6>
                      <h3 className="mb-0">{stats.totalAnimals}</h3>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle p-3 bg-warning bg-opacity-10 me-3">
                      <FaEgg size={24} className="text-warning" />
                    </div>
                    <div>
                      <h6 className="mb-0">Desovas</h6>
                      <h3 className="mb-0">{stats.totalSpawns}</h3>
                      <small className="text-muted">
                        {stats.upcomingSpawns} programadas
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Gráficos */}
          <div className="content-card">
            <h2 className="card-title">Gráficos e Estatísticas</h2>
            <Row>
              <Col lg={6} md={12} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Distribuição por Espécie</h5>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={speciesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {speciesData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6} md={12} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Desovas por Mês</h5>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={spawnsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(month) => {
                            const months = [
                              'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                              'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
                            ];
                            return months[month - 1];
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(month) => {
                            const months = [
                              'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                              'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                            ];
                            return months[month - 1];
                          }}
                        />
                        <Bar dataKey="spawns" fill="#FFBB28" name="Desovas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}

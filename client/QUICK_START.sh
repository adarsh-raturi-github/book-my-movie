#!/bin/bash

# Quick Start Guide for Seat Selection Feature

echo "🎬 BookMyMovie - Seat Selection Feature Setup"
echo "================================================"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start development server
echo "🚀 Starting development server..."
npm run dev

echo ""
echo "✅ Server running at http://localhost:5173"
echo ""
echo "📍 Try these routes:"
echo "   - http://localhost:5173 (Home page)"
echo "   - http://localhost:5173/booking (Seat selection)"
echo ""
echo "📚 Documentation:"
echo "   - FRONTEND_README.md (Main features)"
echo "   - SEAT_SELECTION_README.md (Seat feature details)"
echo "   - src/examples/SeatSelectionIntegration.tsx (Integration examples)"
echo ""
echo "🧪 Test concurrent bookings:"
echo "   - Open the seat page in multiple tabs"
echo "   - Try booking the same seats simultaneously"
echo "   - Observe conflict resolution"
echo ""

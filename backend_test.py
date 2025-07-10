#!/usr/bin/env python3
import unittest
import requests
import json
import time
from datetime import datetime

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://399dc8ab-dedf-41d8-bb37-63bf18077381.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

class BackendAPITest(unittest.TestCase):
    """Test suite for backend API endpoints"""

    def test_01_root_endpoint(self):
        """Test the root endpoint returns the expected response"""
        print(f"\n🔍 Testing root endpoint: {API_BASE_URL}/")
        response = requests.get(f"{API_BASE_URL}/")
        
        self.assertEqual(response.status_code, 200, f"Expected status code 200, got {response.status_code}")
        data = response.json()
        self.assertIn("message", data, "Response should contain 'message' field")
        self.assertEqual(data["message"], "Hello World", "Message should be 'Hello World'")
        print("✅ Root endpoint test passed")

    def test_02_create_status_check(self):
        """Test creating a status check entry"""
        print(f"\n🔍 Testing POST status endpoint: {API_BASE_URL}/status")
        
        # Generate a unique client name using timestamp
        client_name = f"test_client_{int(time.time())}"
        payload = {"client_name": client_name}
        
        response = requests.post(f"{API_BASE_URL}/status", json=payload)
        
        self.assertEqual(response.status_code, 200, f"Expected status code 200, got {response.status_code}")
        data = response.json()
        
        # Verify response structure
        self.assertIn("id", data, "Response should contain 'id' field")
        self.assertIn("client_name", data, "Response should contain 'client_name' field")
        self.assertIn("timestamp", data, "Response should contain 'timestamp' field")
        
        # Verify the client name matches what we sent
        self.assertEqual(data["client_name"], client_name, f"Expected client_name '{client_name}', got '{data['client_name']}'")
        
        print("✅ Create status check test passed")
        return client_name

    def test_03_get_status_checks(self):
        """Test retrieving status check entries"""
        print(f"\n🔍 Testing GET status endpoint: {API_BASE_URL}/status")
        
        # First create a new status check to ensure there's data to retrieve
        client_name = self.test_02_create_status_check()
        
        # Now retrieve all status checks
        response = requests.get(f"{API_BASE_URL}/status")
        
        self.assertEqual(response.status_code, 200, f"Expected status code 200, got {response.status_code}")
        data = response.json()
        
        # Verify response is a list
        self.assertIsInstance(data, list, "Response should be a list of status checks")
        
        # Verify our newly created status check is in the list
        found = False
        for status in data:
            if status.get("client_name") == client_name:
                found = True
                break
        
        self.assertTrue(found, f"Newly created status check with client_name '{client_name}' not found in response")
        print("✅ Get status checks test passed")

    def test_04_database_connectivity(self):
        """Test database connectivity by creating and retrieving data"""
        print("\n🔍 Testing database connectivity")
        
        # Create a unique status check
        unique_client = f"db_test_{int(time.time())}"
        create_payload = {"client_name": unique_client}
        
        # Create the status check
        create_response = requests.post(f"{API_BASE_URL}/status", json=create_payload)
        self.assertEqual(create_response.status_code, 200, "Failed to create status check")
        
        # Retrieve all status checks
        get_response = requests.get(f"{API_BASE_URL}/status")
        self.assertEqual(get_response.status_code, 200, "Failed to retrieve status checks")
        
        # Verify our unique status check is in the response
        status_checks = get_response.json()
        found = any(check.get("client_name") == unique_client for check in status_checks)
        
        self.assertTrue(found, f"Database test failed: Status check with client_name '{unique_client}' not found")
        print("✅ Database connectivity test passed")

    def test_05_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n🔍 Testing error handling")
        
        # Test with invalid JSON payload
        print("Testing with invalid JSON payload")
        invalid_payload = "not a json"
        
        try:
            response = requests.post(
                f"{API_BASE_URL}/status", 
                data=invalid_payload, 
                headers={"Content-Type": "application/json"}
            )
            self.assertNotEqual(response.status_code, 200, "Server should reject invalid JSON")
            print(f"✅ Server rejected invalid JSON with status code {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"⚠️ Request failed as expected: {e}")
        
        # Test with missing required field
        print("Testing with missing required field")
        missing_field_payload = {}
        response = requests.post(f"{API_BASE_URL}/status", json=missing_field_payload)
        self.assertNotEqual(response.status_code, 200, "Server should reject payload missing required fields")
        print(f"✅ Server rejected missing fields with status code {response.status_code}")

if __name__ == "__main__":
    print(f"🚀 Starting backend API tests against {API_BASE_URL}")
    unittest.main(verbosity=2)
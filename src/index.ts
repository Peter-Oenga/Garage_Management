// Import necessary libraries
import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express from "express";

// Define the Customer class to represent garage customers
class Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  createdAt: Date;

  constructor(name: string, contact: string, email: string) {
    this.id = uuidv4();
    this.name = name;
    this.contact = contact;
    this.email = email;
    this.createdAt = new Date();
  }
}

// Define the Vehicle class to represent customer vehicles
class Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  createdAt: Date;

  constructor(
    customerId: string,
    make: string,
    model: string,
    year: number,
    licensePlate: string
  ) {
    this.id = uuidv4();
    this.customerId = customerId;
    this.make = make;
    this.model = model;
    this.year = year;
    this.licensePlate = licensePlate;
    this.createdAt = new Date();
  }
}

// Define the Service class to represent services performed on vehicles
class Service {
  id: string;
  vehicleId: string;
  description: string;
  cost: number;
  date: Date;
  createdAt: Date;

  constructor(vehicleId: string, description: string, cost: number, date: Date) {
    this.id = uuidv4();
    this.vehicleId = vehicleId;
    this.description = description;
    this.cost = cost;
    this.date = date;
    this.createdAt = new Date();
  }
}

// Define the Inventory class to represent parts and supplies
class Inventory {
  id: string;
  partName: string;
  quantity: number;
  cost: number;
  createdAt: Date;

  constructor(partName: string, quantity: number, cost: number) {
    this.id = uuidv4();
    this.partName = partName;
    this.quantity = quantity;
    this.cost = cost;
    this.createdAt = new Date();
  }
}

// Define the Invoice class to represent billing information
class Invoice {
  id: string;
  customerId: string;
  amount: number;
  date: Date;
  createdAt: Date;

  constructor(customerId: string, amount: number, date: Date) {
    this.id = uuidv4();
    this.customerId = customerId;
    this.amount = amount;
    this.date = date;
    this.createdAt = new Date();
  }
}

// Initialize stable maps for storing garage data
const customersStorage = StableBTreeMap<string, Customer>(0);
const vehiclesStorage = StableBTreeMap<string, Vehicle>(1);
const servicesStorage = StableBTreeMap<string, Service>(2);
const inventoryStorage = StableBTreeMap<string, Inventory>(3);
const invoicesStorage = StableBTreeMap<string, Invoice>(4);

// Define the express server
export default Server(() => {
  const app = express();
  app.use(express.json());

  // Endpoint for creating a new customer
  app.post("/customers", (req, res) => {
    if (
      !req.body.name ||
      typeof req.body.name !== "string" ||
      !req.body.contact ||
      typeof req.body.contact !== "string" ||
      !req.body.email ||
      typeof req.body.email !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name', 'contact', and 'email' are provided and are strings.",
      });
      return;
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(req.body.email)) {
      res.status(400).json({
        error: "Invalid email format: Ensure the email address is valid.",
      });
      return;
    }

    // Validate contact format
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(req.body.contact)) {
      res.status(400).json({
        error: "Invalid contact format: Ensure the contact number is a 10-digit number.",
      });
      return;
    }

    // Validate email uniqueness
    const existingCustomer = customersStorage.values().find(
      (customer) => customer.email === req.body.email
    );
    if (existingCustomer) {
      res.status(400).json({
        error: "Email already exists: Ensure the email address is unique.",
      });
      return;
    }
    
    try {
      const customer = new Customer(
        req.body.name,
        req.body.contact,
        req.body.email
      );
      customersStorage.insert(customer.id, customer);
      res.status(201).json({
        message: "Customer created successfully",
        customer: customer,
      });
    } catch (error) {
      console.error("Failed to create customer:", error);
      res.status(500).json({
        error: "Server error occurred while creating the customer.",
      });
    }
  });

  // Endpoint for retrieving all customers
  app.get("/customers", (req, res) => {
    try {
      const customers = customersStorage.values();
      res.status(200).json({
        message: "Customers retrieved successfully",
        customers: customers,
      });
    } catch (error) {
      console.error("Failed to retrieve customers:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving customers.",
      });
    }
  });

  // Endpoint for creating a new vehicle
  app.post("/vehicles", (req, res) => {
    if (
      !req.body.customerId ||
      typeof req.body.customerId !== "string" ||
      !req.body.make ||
      typeof req.body.make !== "string" ||
      !req.body.model ||
      typeof req.body.model !== "string" ||
      !req.body.year ||
      typeof req.body.year !== "number" ||
      !req.body.licensePlate ||
      typeof req.body.licensePlate !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'customerId', 'make', 'model', 'year', and 'licensePlate' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const vehicle = new Vehicle(
        req.body.customerId,
        req.body.make,
        req.body.model,
        req.body.year,
        req.body.licensePlate
      );
      vehiclesStorage.insert(vehicle.id, vehicle);
      res.status(201).json({
        message: "Vehicle created successfully",
        vehicle: vehicle,
      });
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      res.status(500).json({
        error: "Server error occurred while creating the vehicle.",
      });
    }
  });

  // Endpoint for retrieving all vehicles
  app.get("/vehicles", (req, res) => {
    try {
      const vehicles = vehiclesStorage.values();
      res.status(200).json({
        message: "Vehicles retrieved successfully",
        vehicles: vehicles,
      });
    } catch (error) {
      console.error("Failed to retrieve vehicles:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving vehicles.",
      });
    }
  });

  // Endpoint for creating a new service
  app.post("/services", (req, res) => {
    if (
      !req.body.vehicleId ||
      typeof req.body.vehicleId !== "string" ||
      !req.body.description ||
      typeof req.body.description !== "string" ||
      !req.body.cost ||
      typeof req.body.cost !== "number" ||
      !req.body.date
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'vehicleId', 'description', 'cost', and 'date' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const service = new Service(
        req.body.vehicleId,
        req.body.description,
        req.body.cost,
        new Date(req.body.date)
      );
      servicesStorage.insert(service.id, service);
      res.status(201).json({
        message: "Service created successfully",
        service: service,
      });
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(500).json({
        error: "Server error occurred while creating the service.",
      });
    }
  });

  // Endpoint for retrieving all services
  app.get("/services", (req, res) => {
    try {
      const services = servicesStorage.values();
      res.status(200).json({
        message: "Services retrieved successfully",
        services: services,
      });
    } catch (error) {
      console.error("Failed to retrieve services:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving services.",
      });
    }
  });

  // Endpoint for creating a new inventory item
  app.post("/inventory", (req, res) => {
    if (
      !req.body.partName ||
      typeof req.body.partName !== "string" ||
      !req.body.quantity ||
      typeof req.body.quantity !== "number" ||
      !req.body.cost ||
      typeof req.body.cost !== "number"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'partName', 'quantity', and 'cost' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const inventory = new Inventory(
        req.body.partName,
        req.body.quantity,
        req.body.cost
      );
      inventoryStorage.insert(inventory.id, inventory);
      res.status(201).json({
        message: "Inventory item created successfully",
        inventory: inventory,
      });
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      res.status(500).json({
        error: "Server error occurred while creating the inventory item.",
      });
    }
  });

  // Endpoint for retrieving all inventory items
  app.get("/inventory", (req, res) => {
    try {
      const inventory = inventoryStorage.values();
      res.status(200).json({
        message: "Inventory items retrieved successfully",
        inventory: inventory,
      });
    } catch (error) {
      console.error("Failed to retrieve inventory items:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving inventory items.",
      });
    }
  });

  // Endpoint for creating a new invoice
  app.post("/invoices", (req, res) => {
    if (
      !req.body.customerId ||
      typeof req.body.customerId !== "string" ||
      !req.body.amount ||
      typeof req.body.amount !== "number" ||
      !req.body.date
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'customerId', 'amount', and 'date' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const invoice = new Invoice(
        req.body.customerId,
        req.body.amount,
        new Date(req.body.date)
      );
      invoicesStorage.insert(invoice.id, invoice);
      res.status(201).json({
        message: "Invoice created successfully",
        invoice: invoice,
      });
    } catch (error) {
      console.error("Failed to create invoice:", error);
      res.status(500).json({
        error: "Server error occurred while creating the invoice.",
      });
    }
  });

  // Endpoint for retrieving all invoices
  app.get("/invoices", (req, res) => {
    try {
      const invoices = invoicesStorage.values();
      res.status(200).json({
        message: "Invoices retrieved successfully",
        invoices: invoices,
      });
    } catch (error) {
      console.error("Failed to retrieve invoices:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving invoices.",
      });
    }
  });

  // Start the server
  return app.listen();
});

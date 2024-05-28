import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express, { Request, Response } from "express";

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

// Utility function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

// Utility function to validate contact format
function isValidContact(contact: string): boolean {
  const contactRegex = /^\d{10}$/;
  return contactRegex.test(contact);
}

// Utility function to check if email is unique
function isUniqueEmail(email: string): boolean {
  return !customersStorage.values().find((customer) => customer.email === email);
}

// Utility function to handle common error responses
function handleValidationError(res: Response, error: string): void {
  res.status(400).json({ error });
}

// Define the express server
export default Server(() => {
  const app = express();
  app.use(express.json());

  // Endpoint for creating a new customer
  app.post("/customers", (req: Request, res: Response) => {
    const { name, contact, email } = req.body;

    if (!name || typeof name !== "string" || !contact || typeof contact !== "string" || !email || typeof email !== "string") {
      return handleValidationError(res, "Invalid input: Ensure 'name', 'contact', and 'email' are provided and are strings.");
    }

    if (!isValidEmail(email)) {
      return handleValidationError(res, "Invalid email format: Ensure the email address is valid.");
    }

    if (!isValidContact(contact)) {
      return handleValidationError(res, "Invalid contact format: Ensure the contact number is a 10-digit number.");
    }

    if (!isUniqueEmail(email)) {
      return handleValidationError(res, "Email already exists: Ensure the email address is unique.");
    }

    try {
      const customer = new Customer(name, contact, email);
      customersStorage.insert(customer.id, customer);
      res.status(201).json({ message: "Customer created successfully", customer });
    } catch (error) {
      console.error("Failed to create customer:", error);
      res.status(500).json({ error: "Server error occurred while creating the customer." });
    }
  });

  // Endpoint for retrieving all customers
  app.get("/customers", (req: Request, res: Response) => {
    try {
      const customers = customersStorage.values();
      res.status(200).json({ message: "Customers retrieved successfully", customers });
    } catch (error) {
      console.error("Failed to retrieve customers:", error);
      res.status(500).json({ error: "Server error occurred while retrieving customers." });
    }
  });

  // Endpoint for creating a new vehicle
  app.post("/vehicles", (req: Request, res: Response) => {
    const { customerId, make, model, year, licensePlate } = req.body;

    if (!customerId || typeof customerId !== "string" || !make || typeof make !== "string" || !model || typeof model !== "string" || typeof year !== "number" || !licensePlate || typeof licensePlate !== "string") {
      return handleValidationError(res, "Invalid input: Ensure 'customerId', 'make', 'model', 'year', and 'licensePlate' are provided and are of the correct types.");
    }

    try {
      const vehicle = new Vehicle(customerId, make, model, year, licensePlate);
      vehiclesStorage.insert(vehicle.id, vehicle);
      res.status(201).json({ message: "Vehicle created successfully", vehicle });
    } catch (error) {
      console.error("Failed to create vehicle:", error);
      res.status(500).json({ error: "Server error occurred while creating the vehicle." });
    }
  });

  // Endpoint for retrieving all vehicles
  app.get("/vehicles", (req: Request, res: Response) => {
    try {
      const vehicles = vehiclesStorage.values();
      res.status(200).json({ message: "Vehicles retrieved successfully", vehicles });
    } catch (error) {
      console.error("Failed to retrieve vehicles:", error);
      res.status(500).json({ error: "Server error occurred while retrieving vehicles." });
    }
  });

  // Endpoint for creating a new service
  app.post("/services", (req: Request, res: Response) => {
    const { vehicleId, description, cost, date } = req.body;

    if (!vehicleId || typeof vehicleId !== "string" || !description || typeof description !== "string" || typeof cost !== "number" || !date) {
      return handleValidationError(res, "Invalid input: Ensure 'vehicleId', 'description', 'cost', and 'date' are provided and are of the correct types.");
    }

    try {
      const service = new Service(vehicleId, description, cost, new Date(date));
      servicesStorage.insert(service.id, service);
      res.status(201).json({ message: "Service created successfully", service });
    } catch (error) {
      console.error("Failed to create service:", error);
      res.status(500).json({ error: "Server error occurred while creating the service." });
    }
  });

  // Endpoint for retrieving all services
  app.get("/services", (req: Request, res: Response) => {
    try {
      const services = servicesStorage.values();
      res.status(200).json({ message: "Services retrieved successfully", services });
    } catch (error) {
      console.error("Failed to retrieve services:", error);
      res.status(500).json({ error: "Server error occurred while retrieving services." });
    }
  });

  // Endpoint for creating a new inventory item
  app.post("/inventory", (req: Request, res: Response) => {
    const { partName, quantity, cost } = req.body;

    if (!partName || typeof partName !== "string" || typeof quantity !== "number" || typeof cost !== "number") {
      return handleValidationError(res, "Invalid input: Ensure 'partName', 'quantity', and 'cost' are provided and are of the correct types.");
    }

    try {
      const inventory = new Inventory(partName, quantity, cost);
      inventoryStorage.insert(inventory.id, inventory);
      res.status(201).json({ message: "Inventory item created successfully", inventory });
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      res.status(500).json({ error: "Server error occurred while creating the inventory item." });
    }
  });

  // Endpoint for retrieving all inventory items
  app.get("/inventory", (req: Request, res: Response) => {
    try {
      const inventory = inventoryStorage.values();
      res.status(200).json({ message: "Inventory items retrieved successfully", inventory });
    } catch (error) {
      console.error("Failed to retrieve inventory items:", error);
      res.status(500).json({ error: "Server error occurred while retrieving inventory items." });
    }
  });

  // Endpoint for creating a new invoice
  app.post("/invoices", (req: Request, res: Response) => {
    const { customerId, amount, date } = req.body;

    if (!customerId || typeof customerId !== "string" || typeof amount !== "number" || !date) {
      return handleValidationError(res, "Invalid input: Ensure 'customerId', 'amount', and 'date' are provided and are of the correct types.");
    }

    try {
      const invoice = new Invoice(customerId, amount, new Date(date));
      invoicesStorage.insert(invoice.id, invoice);
      res.status(201).json({ message: "Invoice created successfully", invoice });
    } catch (error) {
      console.error("Failed to create invoice:", error);
      res.status(500).json({ error: "Server error occurred while creating the invoice." });
    }
  });

  // Endpoint for retrieving all invoices
  app.get("/invoices", (req: Request, res: Response) => {
    try {
      const invoices = invoicesStorage.values();
      res.status(200).json({ message: "Invoices retrieved successfully", invoices });
    } catch (error) {
      console.error("Failed to retrieve invoices:", error);
      res.status(500).json({ error: "Server error occurred while retrieving invoices." });
    }
  });

  // Start the server
  return app.listen();
});

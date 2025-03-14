INSERT INTO "Vehicle" ("vehicleNo", "vehicleType") VALUES 
('ABC-1234', 'Sedan'),
('XYZ-5678', 'SUV'),
('LMN-9101', 'Truck'),
('PQR-2345', 'Electric Car'),
('DEF-6789', 'Van');



INSERT INTO "Vendor" ("vendorName", "vendorPh") VALUES 
('Best Vendors', '9876543210'),
('Elite Services', '8765432109'),
('Auto Hub', '7654321098'),
('Premium Motors', '6543210987'),
('Speedy Suppliers', '5432109876');


INSERT INTO "Driver" ("driverName", "phoneNo", "vehicleId", "vendorId") VALUES 
('Ramesh Kumar', '9876543210', 1, 1), 
('Suresh Reddy', '9876501234', 2, 2), 
('Amit Singh', '7890654321', 3, 3), 
('Rajesh Patil', '7890123456', 4, NULL); -- NULL for drivers without a vendor


INSERT INTO "Category" ("name") VALUES 
('Luxury Cars'),
('Economy Cars'),
('SUVs'),
('Electric Vehicles'),
('Commercial Vehicles');



INSERT INTO "Company" ("companyName") VALUES 
('Tech Solutions'),
('Global Logistics'),
('Green Energy Co.'),
('Smart Innovations'),
('NextGen Tech');

INSERT INTO "Customers" ("customerName", "phoneNo", "companyId") VALUES 
('John Doe', '1234567890', 1),
('Alice Johnson', '2345678901', 2),
('Robert Brown', '3456789012', 3),
('Emma Wilson', '4567890123', 4),
('Michael Lee', '5678901234', 5);


import tkinter as tk
from tkinter import messagebox
from pymongo import MongoClient
import pandas as pd

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['excel']
collection = db['new']

# Read data from Excel file
excel_file = 'telugu_test.xlsx'  # Replace with the path to your Excel file
sheet_name = 'Sheet1'  # Replace with the name of the sheet in your Excel file
data = pd.read_excel(excel_file, sheet_name=sheet_name)

column_a_data = data['Telugu Words'].tolist()  # Replace 'Column_A_header' with the actual header name in your Excel file

def save_to_mongodb():
    for i, (entry_b, entry_c) in enumerate(zip(entries_b, entries_c)):
        data = {
            'column_a': column_a_data[i],
            'column_b': entry_b.get(),
            'column_c': entry_c.get()
        }
        collection.insert_one(data)
    messagebox.showinfo("Success", "Data saved to MongoDB!")

# Initialize Tkinter window
root = tk.Tk()
root.title("Data Entry for Telugu Text")

# Create headers
tk.Label(root, text="Column A (Telugu Text)").grid(row=0, column=0)
tk.Label(root, text="Column B (Input)").grid(row=0, column=1)
tk.Label(root, text="Column C (Input)").grid(row=0, column=2)

# Create input fields
entries_b = []
entries_c = []

for i, text in enumerate(column_a_data):
    tk.Label(root, text=text).grid(row=i+1, column=0)
    
    entry_b = tk.Entry(root)
    entry_b.grid(row=i+1, column=1)
    entries_b.append(entry_b)
    
    entry_c = tk.Entry(root)
    entry_c.grid(row=i+1, column=2)
    entries_c.append(entry_c)

# Create save button
save_button = tk.Button(root, text="Save to MongoDB", command=save_to_mongodb)
save_button.grid(row=len(column_a_data)+1, columnspan=3)

root.mainloop()
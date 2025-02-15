// src/components/projects/custom-risk-categories.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface CustomField {
  id: string
  name: string
  type: 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'CHECKBOX'
  required: boolean
  options?: string[] // For SELECT type fields
}

interface CustomCategory {
  id: string
  name: string
  description: string
  color: string
  fields: CustomField[]
}

export function CustomRiskCategories() {
  const [categories, setCategories] = useState<CustomCategory[]>([])
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingField, setIsAddingField] = useState<string | null>(null)

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
  })

  const [newField, setNewField] = useState({
    name: '',
    type: 'TEXT',
    required: false,
    options: [''],
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/risk-categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/risk-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) throw new Error('Failed to add category')

      const addedCategory = await response.json()
      setCategories([...categories, addedCategory])
      setIsAddingCategory(false)
      setNewCategory({ name: '', description: '', color: '#3B82F6' })
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const addField = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/risk-categories/${categoryId}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newField),
      })

      if (!response.ok) throw new Error('Failed to add field')

      const updatedCategory = await response.json()
      setCategories(categories.map(cat => 
        cat.id === categoryId ? updatedCategory : cat
      ))
      setIsAddingField(null)
      setNewField({ name: '', type: 'TEXT', required: false, options: [''] })
    } catch (error) {
      console.error('Error adding field:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Custom Risk Categories</h2>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="text-lg font-medium">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingCategory(category.id)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500">Custom Fields</h4>
                <button
                  onClick={() => setIsAddingField(category.id)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Add Field
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {category.fields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-sm text-gray-500">
                        Type: {field.type}
                        {field.required && ' • Required'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-500">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Add Risk Category</h3>
            <form onSubmit={addCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="mt-1 block w-full"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {isAddingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Add Custom Field</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              addField(isAddingField)
            }} className="space-y-4">
              {/* Field form fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field Name
                </label>
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field Type
                </label>
                <select
                  value={newField.type}
                  onChange={(e) => setNewField({ ...newField, type: e.target.value as CustomField['type'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                  <option value="DATE">Date</option>
                  <option value="SELECT">Select</option>
                  <option value="CHECKBOX">Checkbox</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Required field
                </label>
              </div>

              {newField.type === 'SELECT' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <div className="space-y-2">
                    {newField.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newField.options]
                            newOptions[index] = e.target.value
                            setNewField({ ...newField, options: newOptions })
                          }}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = newField.options.filter((_, i) => i !== index)
                            setNewField({ ...newField, options: newOptions })
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setNewField({
                        ...newField,
                        options: [...newField.options, '']
                      })}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingField(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
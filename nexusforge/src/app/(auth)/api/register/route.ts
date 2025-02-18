// src/app/(auth)/api/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma, testPrismaConnection } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
  console.log('Registration route started')

  // Test database connection first
  const connectionResult = await testPrismaConnection()
  if (!connectionResult) {
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  }

  try {
    // Parse the request body
    const body = await req.json()
    console.log('Received registration data:', JSON.stringify(body, null, 2))

    // Validate that all required fields are present and non-empty
    const requiredFields = ['name', 'email', 'password', 'role', 'country', 'gender']
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
        console.error(`Invalid or missing field: ${field}`)
        return NextResponse.json(
          { error: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` },
          { status: 400 }
        )
      }
    }

    // Sanitize inputs
    const sanitizedData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      password: body.password,
      role: body.role,
      country: body.country,
      gender: body.gender // Include gender in sanitized data
    }

    console.log('Sanitized registration data:', JSON.stringify(sanitizedData, null, 2))

    // Check for existing user
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: sanitizedData.email },
        select: { id: true }
      })

      if (existingUser) {
        console.log('User already exists with this email')
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        )
      }
    } catch (lookupError) {
      console.error('Error checking existing user:', lookupError)
      return NextResponse.json(
        { error: 'Database lookup failed', details: String(lookupError) },
        { status: 500 }
      )
    }

    // Hash password
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(sanitizedData.password, 10)
    } catch (hashError) {
      console.error('Password hashing failed:', hashError)
      return NextResponse.json(
        { error: 'Password hashing failed' },
        { status: 500 }
      )
    }

    // Create new user
    let newUser
    try {
      newUser = await prisma.user.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          password: hashedPassword,
          role: sanitizedData.role,
          country: sanitizedData.country,
          gender: sanitizedData.gender, // Add gender field
          expertise: [],
          experience: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          gender: true, // Also include gender in the response
          country: true,
          createdAt: true,
        }
      })
      
      console.log('User created successfully:', JSON.stringify(newUser, null, 2))
    } catch (error) {
      console.error('User creation error:', error)
      
      // Modified type checking
      if (
        error instanceof Error && 
        'code' in error
      ) {
        return NextResponse.json(
          { 
            error: 'User creation failed', 
            code: (error as any).code,
            message: error.message
          },
          { status: 500 }
        )
      }
  
      return NextResponse.json(
        { error: 'Failed to create user', details: String(error) },
        { status: 500 }
      )
    }

    // Return user data without sensitive information
    return NextResponse.json(newUser)

  } catch (error) {
    console.error('Overall registration error:', error)

    return NextResponse.json(
      { error: 'Registration failed', details: String(error) },
      { status: 500 }
    )
  }
}
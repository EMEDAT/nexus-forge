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
    const requiredFields = ['name', 'email', 'password', 'role', 'country']
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
      country: body.country
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
          expertise: [],
          experience: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          country: true,
          createdAt: true,
        }
      })
      
      console.log('User created successfully:', JSON.stringify(newUser, null, 2))
    } catch (createError) {
      console.error('User creation error:', createError)
      
      // More specific error handling
      if (createError instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json(
          { 
            error: 'User creation failed', 
            code: createError.code,
            meta: createError.meta 
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to create user', details: String(createError) },
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
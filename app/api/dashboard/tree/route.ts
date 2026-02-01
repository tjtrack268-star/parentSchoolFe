import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get user from session/token (you might need to implement proper auth)
    const authHeader = request.headers.get('authorization')
    
    // For now, fetch the organigramme data from Spring Boot
    const response = await fetch('http://localhost:8080/api/organigramme', {
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Convert the organigramme data to tree format expected by frontend
    const convertToTreeFormat = (nodes: any[]): any => {
      if (!nodes || nodes.length === 0) return []
      
      return nodes.map(node => ({
        id: node.id.toString(),
        name: `${node.firstName} ${node.lastName}`,
        email: node.email || '',
        grade: node.gradeName,
        points: node.totalPoints,
        children: convertToTreeFormat(node.children || [])
      }))
    }

    const treeData = convertToTreeFormat(data)
    
    // Return the first root node or empty structure
    const result = treeData.length > 0 ? treeData[0] : {
      id: '1',
      name: 'Aucun réseau',
      email: '',
      grade: 'Aucun',
      points: 0,
      children: []
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching tree:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
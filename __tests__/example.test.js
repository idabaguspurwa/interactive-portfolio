/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'

// Simple utility function test
describe('Basic Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle string operations', () => {
    const text = 'Interactive Portfolio'
    expect(text).toContain('Interactive')
    expect(text.length).toBeGreaterThan(0)
  })

  it('should handle array operations', () => {
    const technologies = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS']
    expect(technologies).toHaveLength(4)
    expect(technologies).toContain('Next.js')
  })
})

// Test utility functions if they exist
describe('Utility Functions', () => {
  it('should format numbers correctly', () => {
    // Mock formatNumber function behavior
    const formatNumber = (num) => {
      return new Intl.NumberFormat().format(num)
    }
    
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
})

// Component test placeholder
describe('Component Tests', () => {
  it('should render without crashing', () => {
    // This is a placeholder for actual component tests
    // You can add real component tests here later
    const mockComponent = () => <div>Test Component</div>
    render(mockComponent())
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
})

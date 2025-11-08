import { Button } from "@/components/ui/button"

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
        const response = await fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Error while logging out:', error);
    }
  }

  return (
    <Button 
      onClick={handleLogout} 
      className="hover:bg-black bg-tranparent border border-black text-black hover:text-white rounded-md px-4 py-1.5"
    >
      Logout
    </Button>
  )
}


import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Lightbulb, Home, Bed, ArrowRight, ArrowLeft } from "lucide-react";

interface StructureTabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StructureTabModal: React.FC<StructureTabModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>What is Building Structure?</span>
              </h3>
              <p className="text-gray-600">
                Building Structure allows you to create detailed layouts of your property with multiple buildings, 
                floors, and individual rooms. This helps students visualize your property better and makes 
                booking management more precise.
              </p>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Building className="w-5 h-5 text-green-500" />
                <span>Building Types</span>
              </h3>
              <p className="text-gray-600">
                We support three main building types:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li><strong>Storey Buildings</strong> - Multi-level structures where the first floor is called the ground floor</li>
                <li><strong>Apartments</strong> - Can be in a storey building or regular building format</li>
                <li><strong>Converted Homes</strong> - Residential homes that have been converted into student accommodation</li>
              </ul>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Home className="w-5 h-5 text-purple-500" />
                <span>Intelligent Building Creator</span>
              </h3>
              <p className="text-gray-600">
                The Intelligent Building Creator helps you quickly generate your entire building structure based on your inputs:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li>Enter your building name and optional room naming prefix</li>
                <li>Specify the number of floors, rooms per floor, and beds per room</li>
                <li>Set a base rent for standard pricing</li>
                <li>Choose a default room type</li>
              </ul>
              <p className="text-gray-600 mt-2">
                After generation, you can customize individual rooms, floors, and buildings to match your exact property layout.
              </p>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Bed className="w-5 h-5 text-orange-500" />
                <span>Room Configuration</span>
              </h3>
              <p className="text-gray-600">
                Each room can have unique configurations:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                <li>Different number of beds (1-in-a-room, 2-in-a-room, etc.)</li>
                <li>Varying rent amounts based on features and amenities</li>
                <li>Special amenities like air conditioning, private bathroom, etc.</li>
                <li>Different room types (Single, Double, Shared, Executive)</li>
              </ul>
              <p className="text-gray-600 mt-2">
                You can edit any room after creation to add these special configurations.
              </p>
            </CardContent>
          </Card>
        );
      case 5:
        return (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-gray-600">
                Use the <strong>Intelligent Building Creator</strong> to quickly generate your entire building 
                structure with consistent room naming (like 1FK01, 1FK02 based on your chosen prefix). 
                You can always edit individual rooms later to match your exact property layout!
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Remember: The base rent in the Intelligent Building Creator is a starting point. You can adjust 
                prices for individual rooms based on their features and amenities.
              </p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Building Structure Guide</DialogTitle>
        <div className="space-y-6">
          {renderPageContent()}
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              {currentPage > 1 && (
                <Button variant="outline" size="sm" onClick={prevPage}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {currentPage < totalPages ? (
                <Button size="sm" onClick={nextPage}>
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={onClose}>
                  Got it, let's build!
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StructureTabModal;

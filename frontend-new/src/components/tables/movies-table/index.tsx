'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { useNavigate } from 'react-router-dom';
import { Movie } from '@/types/movies';

interface ProductsClientProps {
  data: Movie[];
}

export const MoviesTable: React.FC<ProductsClientProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className='space-y-4'>
      <div className="flex items-start justify-between">
        <Heading
          title={`Movies (${data.length})`}
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => navigate(`/dashboard/movies/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
    </div>
  );
};

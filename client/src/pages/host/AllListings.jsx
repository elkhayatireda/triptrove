import React, { useEffect, useState } from 'react';
import { axiosClient } from '@/api/axios';
import PropertyCard from '@/components/host/PropertyCard';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { toast } from 'react-toastify';

function AllListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axiosClient.get('/properties/host');
                setListings(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleRemoveListing = async (id) => {
        try {
            await axiosClient.delete('/properties/' + id);
            setListings(prevListings => prevListings.filter(listing => listing._id !== id));
            toast.success('property deleted successfully')
        } catch (error) {
            toast.error('something went wrong')
        }
    };

    return (
        <div className='p-8'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-3xl font-medium'>All Listings</h1>
                <div className='flex items-center gap-4'>

                    <div className='flex justify-center bg-[#F8F8F8] py-3 px-4 gap-2 items-center  rounded-full focus-within:border-transparent'>
                        <IoSearch className='  text-xl text-[#464545]' />
                        <input
                            type='text'
                            placeholder='search property'
                            className='bg-[#F8F8F8] pl-1 focus:outline-none'
                        />
                    </div>

                    <Link to='/host' className='bg-primary flex justify-center items-center gap-2 text-white px-4 py-2 rounded-full'>
                        <h1 className='text-2xl rounded-md'>+</h1>
                        <h1> Add a property</h1>
                    </Link>
                </div>
            </div>
            {
                loading ?
                    <div>Loading...</div>
                    :
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {listings.map(property => (
                            <PropertyCard
                                key={property._id}
                                property={property}
                                onRemove={handleRemoveListing}
                            />
                        ))}
                    </div>
            }
        </div>
    );
}

export default AllListings;

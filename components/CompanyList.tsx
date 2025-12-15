import React, { useState } from 'react';
import { Filter, Search, MoreHorizontal, Building2, Plus } from 'lucide-react';
import { Company } from '../types';

interface CompanyListProps {
    onSelectCompany?: (company: Company) => void;
}

export const MOCK_COMPANIES: Company[] = [
    { 
        id: '1', 
        name: 'Công ty CP Đầu tư TMZ', 
        cif: '19283746', 
        taxCode: '09784576398', 
        legalRepresentative: 'Mrs.Hoa', 
        segment: 'Enterprise',
        address: 'Số 123, ngõ 23 đường Thái Thịnh - Phường Thịnh Quang - Quận Đống Đa - Thành phố Hà Nội',
        email: 'anhnqp@gmail.com',
        industry: 'Du lịch, Khách sạn, Nghỉ dưỡng',
        licenseDate: '01/02/2010',
        operatingDate: '01/02/2010',
        owner: 'Ngoan VT',
        ownerEmail: 'ngoanvt@mobioshop',
        description: 'Leading investment firm in hospitality sector.'
    },
    { 
        id: '2', 
        name: 'Globex Inc', 
        cif: '11223344', 
        taxCode: '0300300300', 
        legalRepresentative: 'Sarah Smith', 
        segment: 'Corporate',
        address: '123 Business Rd, Silicon Valley, CA',
        email: 'contact@globex.com',
        industry: 'Logistics'
    },
    { 
        id: '3', 
        name: 'Soylent Corp', 
        cif: '55667788', 
        taxCode: '0400400400', 
        legalRepresentative: 'Mike Brown', 
        segment: 'SME',
        industry: 'Technology'
    },
    { 
        id: '4', 
        name: 'Initech', 
        cif: '22334455', 
        taxCode: '0500500500', 
        legalRepresentative: 'Bill Lumbergh', 
        segment: 'Enterprise',
        industry: 'Software'
    },
    { 
        id: '5', 
        name: 'Umbrella Corp', 
        cif: '66778899', 
        taxCode: '0600600600', 
        legalRepresentative: 'Alice Wong', 
        segment: 'Corporate',
        industry: 'Pharma'
    },
    { 
        id: '6', 
        name: 'Cyberdyne Systems', 
        cif: '99887766', 
        taxCode: '0700700700', 
        legalRepresentative: 'Miles Dyson', 
        segment: 'Enterprise',
        industry: 'Defense'
    },
    { 
        id: '7', 
        name: 'Massive Dynamic', 
        cif: '44556677', 
        taxCode: '0800800800', 
        legalRepresentative: 'Nina Sharp', 
        segment: 'Corporate',
        industry: 'Research'
    },
    { 
        id: '8', 
        name: 'Buy n Large', 
        cif: '11122233', 
        taxCode: '0900900900', 
        legalRepresentative: 'Shelby Forthright', 
        segment: 'Retail',
        industry: 'Retail'
    },
    { 
        id: '9', 
        name: 'Weyland-Yutani', 
        cif: '33445566', 
        taxCode: '1000100100', 
        legalRepresentative: 'Peter Weyland', 
        segment: 'Enterprise',
        industry: 'Space'
    },
    { 
        id: '10', 
        name: 'Stark Industries', 
        cif: '77788899', 
        taxCode: '1100110011', 
        legalRepresentative: 'Pepper Potts', 
        segment: 'Enterprise',
        industry: 'Defense'
    },
    { 
        id: '11', 
        name: 'Acme Corp', 
        cif: '55544433', 
        taxCode: '1200120012', 
        legalRepresentative: 'Wile E. Coyote', 
        segment: 'SME',
        industry: 'Manufacturing'
    },
    { 
        id: '12', 
        name: 'Wayne Enterprises', 
        cif: '99900011', 
        taxCode: '1300130013', 
        legalRepresentative: 'Lucius Fox', 
        segment: 'Enterprise',
        industry: 'Conglomerate'
    },
    { 
        id: '13', 
        name: 'Hooli', 
        cif: '22233344', 
        taxCode: '1400140014', 
        legalRepresentative: 'Gavin Belson', 
        segment: 'Corporate',
        industry: 'Technology'
    },
    { 
        id: '14', 
        name: 'Pied Piper', 
        cif: '88877766', 
        taxCode: '1500150015', 
        legalRepresentative: 'Richard Hendricks', 
        segment: 'SME',
        industry: 'Technology'
    },
    { 
        id: '15', 
        name: 'InGen', 
        cif: '66655544', 
        taxCode: '1600160016', 
        legalRepresentative: 'John Hammond', 
        segment: 'Corporate',
        industry: 'Biotech'
    },
    { 
        id: '16', 
        name: 'Oceanic Airlines', 
        cif: '44433322', 
        taxCode: '1700170017', 
        legalRepresentative: 'Alvar Hanso', 
        segment: 'Enterprise',
        industry: 'Travel'
    },
    { 
        id: '17', 
        name: 'E Corp', 
        cif: '11100099', 
        taxCode: '1800180018', 
        legalRepresentative: 'Phillip Price', 
        segment: 'Enterprise',
        industry: 'Finance'
    },
    { 
        id: '18', 
        name: 'Aperture Science', 
        cif: '33322211', 
        taxCode: '1900190019', 
        legalRepresentative: 'Cave Johnson', 
        segment: 'Corporate',
        industry: 'Research'
    },
    { 
        id: '19', 
        name: 'Tyrell Corp', 
        cif: '55566677', 
        taxCode: '2000200020', 
        legalRepresentative: 'Eldon Tyrell', 
        segment: 'Enterprise',
        industry: 'Biotech'
    },
    { 
        id: '20', 
        name: 'Vandelay Industries', 
        cif: '88899900', 
        taxCode: '2100210021', 
        legalRepresentative: 'Art Vandelay', 
        segment: 'SME',
        industry: 'Import/Export'
    },
];

const CompanyList: React.FC<CompanyListProps> = ({ onSelectCompany }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = MOCK_COMPANIES.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        company.cif.includes(searchTerm) ||
        company.taxCode.includes(searchTerm)
    );

    const getSegmentColor = (segment: string) => {
        switch(segment) {
            case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Corporate': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SME': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Companies</h2>
                    <p className="text-slate-500 text-sm">Manage company profiles and legal information.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm shadow-blue-200">
                    <Plus size={18} />
                    Add Company
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search companies by name, CIF, tax code..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-50 text-sm font-medium">
                            <Filter size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Company Name</th>
                                <th className="px-6 py-4">CIF</th>
                                <th className="px-6 py-4">Tax Code</th>
                                <th className="px-6 py-4">Legal Representative</th>
                                <th className="px-6 py-4">Segment</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCompanies.map(company => (
                                <tr 
                                    key={company.id} 
                                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                    onClick={() => onSelectCompany?.(company)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Building2 size={16} />
                                            </div>
                                            <span className="font-medium text-slate-800">{company.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-mono">{company.cif}</td>
                                    <td className="px-6 py-4 text-slate-600 font-mono">{company.taxCode}</td>
                                    <td className="px-6 py-4 text-slate-600">{company.legalRepresentative}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSegmentColor(company.segment)}`}>
                                            {company.segment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompanyList;
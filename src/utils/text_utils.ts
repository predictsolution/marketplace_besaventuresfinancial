import toast from 'react-hot-toast';

export function resumedAddress(address: string, characters = 4) {
  return `${address.slice(0, characters)}...${address.slice(-characters)}`;
}

export function copy(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Copied!');
}

// Parse date to string
export function parsetDate(dateIn: string) {
  const getDate = new Date(dateIn);
  const formatDate =
    getDate.toLocaleDateString() + ' - ' + getDate.toLocaleTimeString();

  return formatDate;
}

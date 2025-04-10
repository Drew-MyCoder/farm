interface AuthCredentials {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }


  type CoopData = {
    id: number;
    parent_id: number | null;
    status: string;
    total_dead_fowls: number;
    total_fowls: number;
    coop_name: string;
    total_feed: number;
    created_at: string;
    updated_at: string;
    egg_count: number;
    efficiency: number;
    collection_date: string;
    broken_eggs: number;
    notes: string;
  };

  
  type DailyGroup = {
    date: string;
    coops: CoopEntry[];
  };


  type CoopEntry = {
    id: number;
    coop_name: string;
    egg_count: number;
    // Add any other properties as necessary
  };


  type Order = {
  id: number
  name: string
  date_of_delivery: string
  crates_desired: number
  amount: number
  status_of_delivery: "pending" | "processing" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
  by: string
  }
import { NextRequest, NextResponse } from 'next/server';

interface OMDbResponse {
  Title?: string;
  Year?: string;
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Poster?: string;
  IMDbID?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Type?: string;
  Response: string;
  Error?: string;
}

interface ApiResponse {
  success: boolean;
  data?: OMDbResponse;
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Get IMDb ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const imdbId = searchParams.get('imdbId');

    // Validate that IMDb ID is provided
    if (!imdbId) {
      return NextResponse.json(
        {
          success: false,
          error: 'IMDb ID is required. Please provide an imdbId query parameter.',
        },
        { status: 400 }
      );
    }

    // Validate IMDb ID format (should start with "tt")
    if (!/^tt\d+$/.test(imdbId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid IMDb ID format. IMDb IDs should start with "tt" followed by numbers.',
        },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      console.error('OMDB_API_KEY environment variable is not set');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: API key is not configured.',
        },
        { status: 500 }
      );
    }

    // Fetch data from OMDb API
    const omdbUrl = new URL('https://www.omdbapi.com/');
    omdbUrl.searchParams.append('apikey', apiKey);
    omdbUrl.searchParams.append('i', imdbId);
    omdbUrl.searchParams.append('type', 'movie');

    const response = await fetch(omdbUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is ok
    if (!response.ok) {
      console.error(`OMDb API error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch data from OMDb API: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data: OMDbResponse = await response.json();

    // Check if OMDb returned an error
    if (data.Response === 'False') {
      return NextResponse.json(
        {
          success: false,
          error: data.Error || 'Movie not found in OMDb database.',
        },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in /api/movie route:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      {
        success: false,
        error: `Internal server error: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
